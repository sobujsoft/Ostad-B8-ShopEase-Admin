import { ref } from 'vue';
import axios from 'axios';
import { router } from '@inertiajs/vue3';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_ORIGIN = new URL(API_BASE).origin;
const ENDPOINT = `${API_BASE}/v1/categories`;

function resolveImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (clean.startsWith('/storage/')) return `${API_ORIGIN}${clean}`;
    return `${API_ORIGIN}/storage${clean}`;
}

function resolveCategory(cat) {
    if (!cat) return cat;
    return { ...cat, image: resolveImageUrl(cat.image) };
}

export function useCategory() {
    const categories = ref([]);
    const category = ref(null);
    const pagination = ref({});
    const errors = ref({});
    const processing = ref(false);

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

    async function fetchCategories(page = 1) {
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

            categories.value = items.map(resolveCategory);
        } catch (err) {
            categories.value = [];
        } finally {
            processing.value = false;
        }
    }

    async function fetchCategory(id) {
        processing.value = true;
        try {
            const { data } = await axios.get(`${ENDPOINT}/${id}`);
            category.value = resolveCategory(data.data ?? data);
        } catch (_) {
            category.value = null;
        } finally {
            processing.value = false;
        }
    }

    function buildFormData(form) {
        const fd = new FormData();
        fd.append('name', form.name ?? '');
        if (form.description) fd.append('description', form.description);
        if (form.image instanceof File) fd.append('image', form.image);
        fd.append('is_active', form.is_active ? '1' : '0');
        fd.append('sort_order', String(form.sort_order ?? 0));
        return fd;
    }

    async function storeCategory(form) {
        errors.value = {};
        processing.value = true;
        try {
            await axios.post(ENDPOINT, buildFormData(form), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.visit('/categories');
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Failed to create category.' };
            }
        } finally {
            processing.value = false;
        }
    }

    async function updateCategory(id, form) {
        errors.value = {};
        processing.value = true;
        try {
            await axios.post(`${ENDPOINT}/${id}`, buildFormData(form), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.visit('/categories');
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Failed to update category.' };
            }
        } finally {
            processing.value = false;
        }
    }

    async function deleteCategory(id) {
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

    return {
        categories,
        category,
        pagination,
        errors,
        processing,
        fetchCategories,
        fetchCategory,
        storeCategory,
        updateCategory,
        deleteCategory,
    };
}
