import { ref } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_ORIGIN = new URL(API_BASE).origin;
const ENDPOINT = `${API_BASE}/v1/sections`;

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

export function useSection() {
    const sections = ref({});
    const sectionProducts = ref([]);
    const errors = ref({});
    const processing = ref(false);

    async function fetchAllSections() {
        processing.value = true;
        try {
            const { data: res } = await axios.get(ENDPOINT);
            const payload = res.data ?? res;

            const result = {};

            function mapSectionProducts(items) {
                return (items ?? []).map((p) => {
                    const prod = p.product ?? p;
                    return {
                        ...resolveProductImages(prod),
                        pivot_id: p.id,
                        sort_order: p.sort_order ?? 0,
                    };
                });
            }

            if (Array.isArray(payload)) {
                payload.forEach((s) => {
                    const key = s.section_name ?? s.section ?? s.name;
                    result[key] = mapSectionProducts(s.products);
                });
            } else if (typeof payload === 'object') {
                Object.entries(payload).forEach(([key, val]) => {
                    const items = Array.isArray(val) ? val : (val.products ?? []);
                    result[key] = mapSectionProducts(items);
                });
            }

            sections.value = result;
        } catch (_) {
            sections.value = {};
        } finally {
            processing.value = false;
        }
    }

    async function fetchSection(sectionName) {
        processing.value = true;
        try {
            const { data: res } = await axios.get(`${ENDPOINT}/${sectionName}`);
            const payload = res.data ?? res;

            const items = payload.products ?? (Array.isArray(payload) ? payload : []);
            sectionProducts.value = items.map((p) => {
                const prod = p.product ?? p;
                return {
                    ...resolveProductImages(prod),
                    pivot_id: p.id,
                    sort_order: p.sort_order ?? 0,
                };
            });
        } catch (_) {
            sectionProducts.value = [];
        } finally {
            processing.value = false;
        }
    }

    async function assignProducts(sectionName, productIds, sortOrders = []) {
        errors.value = {};
        processing.value = true;
        try {
            await axios.post(`${ENDPOINT}/${sectionName}/products`, {
                product_id: productIds,
                sort_order: sortOrders.length ? sortOrders : undefined,
            });
            return true;
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Failed to assign products.' };
            }
            return false;
        } finally {
            processing.value = false;
        }
    }

    async function updateSortOrder(sectionName, sectionProductId, sortOrder) {
        try {
            await axios.patch(
                `${ENDPOINT}/${sectionName}/products/${sectionProductId}`,
                { sort_order: sortOrder },
            );
            return true;
        } catch (_) {
            return false;
        }
    }

    async function removeProduct(sectionName, sectionProductId) {
        processing.value = true;
        try {
            await axios.delete(`${ENDPOINT}/${sectionName}/products/${sectionProductId}`);
            return true;
        } catch (_) {
            return false;
        } finally {
            processing.value = false;
        }
    }

    return {
        sections,
        sectionProducts,
        errors,
        processing,
        fetchAllSections,
        fetchSection,
        assignProducts,
        updateSortOrder,
        removeProduct,
    };
}
