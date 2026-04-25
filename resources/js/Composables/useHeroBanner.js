import { ref } from 'vue';
import axios from 'axios';
import { router } from '@inertiajs/vue3';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_ORIGIN = new URL(API_BASE).origin;
const ENDPOINT = `${API_BASE}/v1/hero-banners`;

function resolveImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (clean.startsWith('/storage/')) return `${API_ORIGIN}${clean}`;
    return `${API_ORIGIN}/storage/${clean}`;
}

function resolveBanner(banner) {
    if (!banner) return banner;
    return { ...banner, banner_img: resolveImageUrl(banner.banner_img) };
}

export function useHeroBanner() {
    const banners = ref([]);
    const banner = ref(null);
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

    async function fetchBanners(page = 1) {
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

            banners.value = items.map(resolveBanner);
        } catch (err) {
            banners.value = [];
        } finally {
            processing.value = false;
        }
    }

    async function fetchBanner(id) {
        processing.value = true;
        try {
            const { data } = await axios.get(`${ENDPOINT}/${id}`);
            banner.value = resolveBanner(data.data ?? data);
        } catch (_) {
            banner.value = null;
        } finally {
            processing.value = false;
        }
    }

    function buildFormData(form) {
        const fd = new FormData();
        fd.append('title', form.title ?? '');
        if (form.badge_txt) fd.append('badge_txt', form.badge_txt);
        if (form.subtitle) fd.append('subtitle', form.subtitle);
        if (form.button_txt) fd.append('button_txt', form.button_txt);
        if (form.button_url) fd.append('button_url', form.button_url);
        if (form.banner_img instanceof File) fd.append('banner_img', form.banner_img);
        fd.append('is_active', form.is_active ? '1' : '0');
        fd.append('sort_order', String(form.sort_order ?? 0));
        return fd;
    }

    async function storeBanner(form) {
        errors.value = {};
        processing.value = true;
        try {
            await axios.post(ENDPOINT, buildFormData(form), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.visit('/hero-banners');
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Failed to create hero banner.' };
            }
        } finally {
            processing.value = false;
        }
    }

    async function updateBanner(id, form) {
        errors.value = {};
        processing.value = true;
        try {
            await axios.post(`${ENDPOINT}/${id}`, buildFormData(form), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.visit('/hero-banners');
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Failed to update hero banner.' };
            }
        } finally {
            processing.value = false;
        }
    }

    async function deleteBanner(id) {
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

    async function toggleActive(id) {
        processing.value = true;
        try {
            const { data } = await axios.patch(`${ENDPOINT}/${id}/toggle-active`);
            return data.data ?? data;
        } catch (_) {
            return null;
        } finally {
            processing.value = false;
        }
    }

    return {
        banners,
        banner,
        pagination,
        errors,
        processing,
        fetchBanners,
        fetchBanner,
        storeBanner,
        updateBanner,
        deleteBanner,
        toggleActive,
    };
}
