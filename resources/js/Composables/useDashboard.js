import { ref } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = `${API_BASE}/v1/dashboard`;

export function useDashboard() {
    const stats = ref([]);
    const recentOrders = ref([]);
    const topCategories = ref([]);
    const processing = ref(false);

    function normalizeStats(data) {
        const payload = data?.stats ?? {};
        return [
            {
                key: 'total_revenue',
                label: 'Total Revenue',
                value: Number(payload.total_revenue?.value ?? 0),
                trend: Number(payload.total_revenue?.change_percentage ?? 0),
            },
            {
                key: 'total_orders',
                label: 'Total Orders',
                value: Number(payload.total_orders?.value ?? 0),
                trend: Number(payload.total_orders?.change_percentage ?? 0),
            },
            {
                key: 'total_products',
                label: 'Total Products',
                value: Number(payload.total_products?.value ?? 0),
                trend: Number(payload.total_products?.change_percentage ?? 0),
            },
            {
                key: 'total_customers',
                label: 'Total Customers',
                value: Number(payload.total_customers?.value ?? 0),
                trend: Number(payload.total_customers?.change_percentage ?? 0),
            },
        ];
    }

    function normalizeRecentOrders(data) {
        const list = data?.recent_orders ?? [];
        return Array.isArray(list) ? list : [];
    }

    function normalizeTopCategories(data) {
        const list = data?.top_categories ?? [];
        return Array.isArray(list) ? list : [];
    }

    async function fetchDashboard() {
        processing.value = true;
        try {
            const { data: res } = await axios.get(ENDPOINT);
            const payload = res?.data ?? res ?? {};
            stats.value = normalizeStats(payload);
            recentOrders.value = normalizeRecentOrders(payload);
            topCategories.value = normalizeTopCategories(payload);
        } catch (_) {
            stats.value = [];
            recentOrders.value = [];
            topCategories.value = [];
        } finally {
            processing.value = false;
        }
    }

    return {
        stats,
        recentOrders,
        topCategories,
        processing,
        fetchDashboard,
    };
}
