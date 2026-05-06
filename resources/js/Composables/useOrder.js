import { ref } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = `${API_BASE}/v1/orders`;

export function useOrder() {
    const orders = ref([]);
    const order = ref(null);
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

    function normalizeOrderItems(payload) {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.items)) return payload.items;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.data?.data)) return payload.data.data;
        return [];
    }

    function normalizeOrderDetail(payload) {
        const detail = payload?.data ?? payload;
        const baseOrder = detail?.order ?? detail;

        if (!baseOrder || typeof baseOrder !== 'object') return null;

        return {
            ...baseOrder,
            item_total: detail?.item_total ?? baseOrder.item_total,
            totals: detail?.totals ?? {
                subtotal: baseOrder.subtotal ?? 0,
                shipping_fee: baseOrder.shipping_fee ?? 0,
                discount_amount: baseOrder.discount_amount ?? 0,
                grand_total: baseOrder.total ?? 0,
            },
        };
    }

    async function fetchOrders(params = {}) {
        processing.value = true;
        try {
            const { data: res } = await axios.get(ENDPOINT, { params });
            const payload = res.data ?? res;
            const listPayload = payload?.data ?? payload;

            if (Array.isArray(listPayload?.data)) {
                orders.value = listPayload.data;
                pagination.value = extractPagination(listPayload);
            } else {
                orders.value = normalizeOrderItems(listPayload);
                pagination.value = {};
            }
        } catch (_) {
            orders.value = [];
            pagination.value = {};
        } finally {
            processing.value = false;
        }
    }

    async function fetchOrder(id) {
        processing.value = true;
        try {
            const { data } = await axios.get(`${ENDPOINT}/${id}`);
            order.value = normalizeOrderDetail(data);
        } catch (_) {
            order.value = null;
        } finally {
            processing.value = false;
        }
    }

    async function updateOrderStatus(id, payload) {
        errors.value = {};
        processing.value = true;
        try {
            const { data } = await axios.patch(`${ENDPOINT}/${id}/status`, payload);
            order.value = normalizeOrderDetail(data);
            return true;
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Failed to update order status.' };
            }
            return false;
        } finally {
            processing.value = false;
        }
    }

    return {
        orders,
        order,
        pagination,
        errors,
        processing,
        fetchOrders,
        fetchOrder,
        updateOrderStatus,
    };
}
