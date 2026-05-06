import { ref } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = `${API_BASE}/v1/customers`;

export function useCustomer() {
    const customers = ref([]);
    const customer = ref(null);
    const pagination = ref({});
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

    function normalizeList(payload) {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.items)) return payload.items;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.data?.data)) return payload.data.data;
        return [];
    }

    async function fetchCustomers(params = {}) {
        processing.value = true;
        try {
            const { data: res } = await axios.get(ENDPOINT, { params });
            const payload = res?.data ?? res;
            const listPayload = payload?.data ?? payload;

            if (Array.isArray(listPayload?.data)) {
                customers.value = listPayload.data;
                pagination.value = extractPagination(listPayload);
            } else {
                customers.value = normalizeList(listPayload);
                pagination.value = {};
            }
        } catch (_) {
            customers.value = [];
            pagination.value = {};
        } finally {
            processing.value = false;
        }
    }

    async function fetchCustomer(id) {
        processing.value = true;
        try {
            const { data: res } = await axios.get(`${ENDPOINT}/${id}`);
            const payload = res?.data ?? res ?? null;
            const baseCustomer = payload?.customer ?? payload;
            const stats = payload?.order_stats ?? {};

            customer.value = baseCustomer
                ? {
                    ...baseCustomer,
                    total_orders: Number(stats.total_orders ?? 0),
                    total_spent: Number(stats.total_spent ?? 0),
                    last_order_at: stats.last_order_at ?? null,
                }
                : null;
        } catch (_) {
            customer.value = null;
        } finally {
            processing.value = false;
        }
    }

    async function toggleActive(id) {
        processing.value = true;
        try {
            await axios.patch(`${ENDPOINT}/${id}/toggle-active`);
            return true;
        } catch (_) {
            return false;
        } finally {
            processing.value = false;
        }
    }

    async function deleteCustomer(id) {
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
        customers,
        customer,
        pagination,
        processing,
        fetchCustomers,
        fetchCustomer,
        toggleActive,
        deleteCustomer,
    };
}
