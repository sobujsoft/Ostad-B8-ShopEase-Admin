import { ref } from 'vue';
import axios from 'axios';
import { router } from '@inertiajs/vue3';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_ORIGIN = new URL(API_BASE).origin;
const ENDPOINT = `${API_BASE}/v1/products`;

function resolveImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (clean.startsWith('/storage/')) return `${API_ORIGIN}${clean}`;
    return `${API_ORIGIN}/storage${clean}`;
}

function resolveProductImages(product) {
    if (!product) return product;
    const images = (product.images ?? []).map((img) => ({
        ...img,
        image_path: resolveImageUrl(img.image_path),
    }));
    return { ...product, images };
}

export function useProduct() {
    const products = ref([]);
    const product = ref(null);
    const pagination = ref({});
    const errors = ref({});
    const processing = ref(false);
    const imageProcessing = ref(false);

    function extractPagination(obj) {
        return {
            current_page: obj.current_page,
            last_page: obj.last_page,
            from: obj.from,
            to: obj.to,
            total: obj.total,
            per_page: obj.per_page,
        };
    }

    // ─── Products CRUD ──────────────────────────────────────

    async function fetchProducts(page = 1) {
        processing.value = true;
        try {
            const { data: res } = await axios.get(ENDPOINT, { params: { page } });
            const payload = res.data ?? res;

            let items = [];
            if (Array.isArray(payload)) {
                items = payload;
                pagination.value = res.meta ?? {};
            } else if (payload && Array.isArray(payload.data)) {
                items = payload.data;
                pagination.value = extractPagination(payload);
            }

            products.value = items.map(resolveProductImages);
        } catch (_) {
            products.value = [];
        } finally {
            processing.value = false;
        }
    }

    async function fetchProduct(id) {
        processing.value = true;
        try {
            const { data } = await axios.get(`${ENDPOINT}/${id}`);
            product.value = resolveProductImages(data.data ?? data);
        } catch (_) {
            product.value = null;
        } finally {
            processing.value = false;
        }
    }

    function buildProductFormData(form) {
        const fd = new FormData();
        fd.append('category_id', String(form.category_id ?? ''));
        fd.append('name', form.name ?? '');
        fd.append('code', form.code ?? '');
        if (form.color) fd.append('color', form.color);
        if (form.size) fd.append('size', form.size);
        if (form.short_description) fd.append('short_description', form.short_description);
        if (form.description) fd.append('description', form.description);
        fd.append('price', String(form.price ?? ''));
        if (form.discount_price !== null && form.discount_price !== '') {
            fd.append('discount_price', String(form.discount_price));
        }
        fd.append('stock_status', form.stock_status ?? 'in_stock');
        fd.append('is_active', form.is_active ? '1' : '0');
        if (form.meta_title) fd.append('meta_title', form.meta_title);
        if (form.meta_description) fd.append('meta_description', form.meta_description);
        return fd;
    }

    async function storeProduct(form) {
        errors.value = {};
        processing.value = true;
        try {
            const { data } = await axios.post(ENDPOINT, buildProductFormData(form), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newId = data.data?.id ?? data.id;
            router.visit(`/products/${newId}/edit`);
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Failed to create product.' };
            }
        } finally {
            processing.value = false;
        }
    }

    async function updateProduct(id, form) {
        errors.value = {};
        processing.value = true;
        try {
            await axios.post(`${ENDPOINT}/${id}`, buildProductFormData(form), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.visit('/products');
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Failed to update product.' };
            }
        } finally {
            processing.value = false;
        }
    }

    async function deleteProduct(id) {
        processing.value = true;
        try {
            await axios.delete(`${ENDPOINT}/${id}`);
            return true;
        } catch (_) {
            return false;
        } finally {
            processing.value = false;
        }
    }

    // ─── Toggle endpoints ───────────────────────────────────

    async function toggleActive(id) {
        try {
            const { data } = await axios.patch(`${ENDPOINT}/${id}/toggle-active`);
            return data.data ?? data;
        } catch (_) {
            return null;
        }
    }

    async function toggleStock(id) {
        try {
            const { data } = await axios.patch(`${ENDPOINT}/${id}/toggle-stock`);
            return data.data ?? data;
        } catch (_) {
            return null;
        }
    }

    // ─── Product Images ─────────────────────────────────────

    async function uploadProductImage(productId, file, isPrimary = false, sortOrder = 0) {
        imageProcessing.value = true;
        try {
            const fd = new FormData();
            fd.append('image', file);
            fd.append('is_primary', isPrimary ? '1' : '0');
            fd.append('sort_order', String(sortOrder));
            const { data } = await axios.post(`${ENDPOINT}/${productId}/images`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.data ?? data;
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            }
            return null;
        } finally {
            imageProcessing.value = false;
        }
    }

    async function updateProductImage(productId, imageId, payload) {
        imageProcessing.value = true;
        try {
            const fd = new FormData();
            if (payload.image instanceof File) fd.append('image', payload.image);
            if (payload.is_primary !== undefined) fd.append('is_primary', payload.is_primary ? '1' : '0');
            if (payload.sort_order !== undefined) fd.append('sort_order', String(payload.sort_order));
            await axios.post(`${ENDPOINT}/${productId}/images/${imageId}`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return true;
        } catch (_) {
            return false;
        } finally {
            imageProcessing.value = false;
        }
    }

    async function deleteProductImage(productId, imageId) {
        imageProcessing.value = true;
        try {
            await axios.delete(`${ENDPOINT}/${productId}/images/${imageId}`);
            return true;
        } catch (_) {
            return false;
        } finally {
            imageProcessing.value = false;
        }
    }

    return {
        products,
        product,
        pagination,
        errors,
        processing,
        imageProcessing,
        fetchProducts,
        fetchProduct,
        storeProduct,
        updateProduct,
        deleteProduct,
        toggleActive,
        toggleStock,
        uploadProductImage,
        updateProductImage,
        deleteProductImage,
    };
}
