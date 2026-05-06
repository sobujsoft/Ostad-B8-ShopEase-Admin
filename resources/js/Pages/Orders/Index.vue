<template>
    <AppLayout>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Orders</h1>
                <p class="text-slate-500 text-sm mt-1">Track and manage customer orders</p>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
                <input
                    v-model="filters.search"
                    type="text"
                    placeholder="Search order/customer..."
                    class="xl:col-span-2 w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <select
                    v-model="filters.status"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">All statuses</option>
                    <option v-for="status in statusOptions" :key="status" :value="status">{{ statusLabel(status) }}</option>
                </select>
                <input
                    v-model="filters.from_date"
                    type="date"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                    v-model="filters.to_date"
                    type="date"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <select
                    v-model.number="filters.per_page"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    <option :value="10">10 / page</option>
                    <option :value="15">15 / page</option>
                    <option :value="25">25 / page</option>
                    <option :value="50">50 / page</option>
                </select>
            </div>
            <div class="flex items-center gap-2 mt-3">
                <button
                    @click="applyFilters"
                    class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
                >
                    Apply
                </button>
                <button
                    @click="resetFilters"
                    class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>

        <div v-if="processing && orders.length === 0" class="flex items-center justify-center py-20">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <div
            v-else-if="!processing && orders.length === 0"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
        >
            <h3 class="text-lg font-semibold text-slate-800 mb-1">No orders found</h3>
            <p class="text-slate-500 text-sm">Try adjusting your filters.</p>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 text-left">
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Payment</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="item in orders" :key="item.id" class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-3.5">
                                <p class="font-medium text-slate-800">{{ item.order_number ?? `#${item.id}` }}</p>
                                <p class="text-xs text-slate-400">ID: {{ item.id }}</p>
                            </td>
                            <td class="px-6 py-3.5">
                                <p class="text-slate-700">{{ item.customer_name ?? item.user?.name ?? 'N/A' }}</p>
                                <p class="text-xs text-slate-400">{{ item.customer_email ?? item.user?.email ?? 'N/A' }}</p>
                            </td>
                            <td class="px-6 py-3.5 text-slate-500 hidden lg:table-cell">
                                {{ formatDate(item.created_at) }}
                            </td>
                            <td class="px-6 py-3.5 font-semibold text-slate-800">
                                {{ money(item.grand_total ?? item.total ?? 0) }}
                            </td>
                            <td class="px-6 py-3.5">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                                    :class="statusClass(item.status)"
                                >
                                    {{ statusLabel(item.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-3.5 hidden xl:table-cell">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-medium text-slate-700 capitalize">
                                        {{ paymentMethodLabel(item.payment_method) }}
                                    </span>
                                    <span
                                        class="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                                        :class="paymentStatusClass(item.payment_status)"
                                    >
                                        {{ statusLabel(item.payment_status) }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-3.5 text-right">
                                <Link
                                    :href="`/orders/${item.id}`"
                                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                v-if="pagination.last_page > 1"
                class="flex items-center justify-between px-6 py-4 border-t border-slate-100"
            >
                <p class="text-sm text-slate-500">
                    Showing {{ pagination.from }}-{{ pagination.to }} of {{ pagination.total }}
                </p>
                <div class="flex items-center gap-1">
                    <button
                        v-for="page in pagination.last_page"
                        :key="page"
                        @click="goToPage(page)"
                        :class="[
                            'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors',
                            page === pagination.current_page
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100',
                        ]"
                    >
                        {{ page }}
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useOrder } from '@/Composables/useOrder';

const { orders, pagination, processing, fetchOrders } = useOrder();

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const filters = ref({
    page: 1,
    per_page: 10,
    status: '',
    search: '',
    from_date: '',
    to_date: '',
});
let searchDebounce = null;

onMounted(() => {
    applyFilters();
});

function cleanParams() {
    const payload = { ...filters.value };
    if (typeof payload.search === 'string') {
        payload.search = payload.search.trim();
    }
    Object.keys(payload).forEach((key) => {
        if (payload[key] === '' || payload[key] === null || payload[key] === undefined) {
            delete payload[key];
        }
    });
    return payload;
}

function applyFilters() {
    filters.value.page = 1;
    fetchOrders(cleanParams());
}

function resetFilters() {
    filters.value = {
        page: 1,
        per_page: 10,
        status: '',
        search: '',
        from_date: '',
        to_date: '',
    };
    fetchOrders(cleanParams());
}

function goToPage(page) {
    filters.value.page = page;
    fetchOrders(cleanParams());
}

function formatDate(value) {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString();
}

function money(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function statusLabel(status) {
    if (!status) return 'Unknown';
    return status.replace('_', ' ');
}

function statusClass(status) {
    const map = {
        pending: 'bg-amber-100 text-amber-700',
        confirmed: 'bg-blue-100 text-blue-700',
        processing: 'bg-indigo-100 text-indigo-700',
        shipped: 'bg-cyan-100 text-cyan-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] ?? 'bg-slate-100 text-slate-700';
}

function paymentMethodLabel(method) {
    if (!method) return 'N/A';
    if (method === 'cod') return 'Cash on Delivery';
    return method.replaceAll('_', ' ');
}

function paymentStatusClass(status) {
    const map = {
        pending: 'bg-amber-100 text-amber-700',
        paid: 'bg-emerald-100 text-emerald-700',
        failed: 'bg-red-100 text-red-700',
        refunded: 'bg-purple-100 text-purple-700',
    };
    return map[status] ?? 'bg-slate-100 text-slate-700';
}

watch(
    () => [filters.value.status, filters.value.from_date, filters.value.to_date, filters.value.per_page],
    () => {
        applyFilters();
    },
);

watch(
    () => filters.value.search,
    () => {
        if (searchDebounce) clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            applyFilters();
        }, 450);
    },
);

onBeforeUnmount(() => {
    if (searchDebounce) clearTimeout(searchDebounce);
});
</script>
