<template>
    <AppLayout>
        <div v-if="processing && stats.length === 0" class="flex items-center justify-center py-24">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <div v-else>
            <!-- Stats grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div
                    v-for="stat in stats"
                    :key="stat.key"
                    class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                >
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-slate-500 text-sm font-medium">{{ stat.label }}</p>
                            <p class="text-2xl font-bold text-slate-800 mt-1">{{ statValue(stat) }}</p>
                            <div class="flex items-center gap-1 mt-2">
                                <span
                                    class="text-xs font-semibold"
                                    :class="stat.trend >= 0 ? 'text-emerald-600' : 'text-red-500'"
                                >
                                    {{ stat.trend >= 0 ? '+' : '' }}{{ stat.trend }}%
                                </span>
                                <span class="text-xs text-slate-400">vs last month</span>
                            </div>
                        </div>
                        <div
                            class="w-11 h-11 rounded-xl flex items-center justify-center"
                            :class="iconClass(stat.key).bg"
                        >
                            <span class="w-5 h-5" :class="iconClass(stat.key).text" v-html="iconClass(stat.key).icon"></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Orders & Top Categories -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <!-- Recent Orders -->
                <div class="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-800">Recent Orders</h3>
                        <Link href="/orders" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">View all</Link>
                    </div>
                    <div v-if="recentOrders.length > 0" class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="bg-slate-50 text-left">
                                    <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                    <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-3.5 font-medium text-slate-800">{{ order.order_number ?? `#${order.id}` }}</td>
                                    <td class="px-6 py-3.5 text-slate-600">{{ order.customer_name ?? 'N/A' }}</td>
                                    <td class="px-6 py-3.5 font-semibold text-slate-800">{{ money(order.total) }}</td>
                                    <td class="px-6 py-3.5">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                                            :class="statusClass(order.status)"
                                        >
                                            {{ order.status ?? 'unknown' }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="p-8 text-center text-sm text-slate-500">No recent orders found.</div>
                </div>

                <!-- Top Categories -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-800">Top Categories</h3>
                    </div>
                    <div v-if="topCategories.length > 0" class="p-6 space-y-4">
                        <div v-for="cat in topCategories" :key="cat.id ?? cat.name">
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-sm font-medium text-slate-700">{{ cat.name }}</span>
                                <span class="text-sm font-semibold text-slate-800">{{ Number(cat.percentage ?? 0).toFixed(1) }}%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2">
                                <div
                                    class="h-2 rounded-full transition-all duration-500 bg-blue-500"
                                    :style="{ width: `${Math.max(0, Math.min(100, Number(cat.percentage ?? 0)))}%` }"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="p-8 text-center text-sm text-slate-500">No category insights available.</div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useDashboard } from '@/Composables/useDashboard';

const { stats, recentOrders, topCategories, processing, fetchDashboard } = useDashboard();

onMounted(() => {
    fetchDashboard();
});

function money(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function statValue(stat) {
    if (stat.key === 'total_revenue') return money(stat.value);
    return Number(stat.value || 0).toLocaleString();
}

function iconClass(key) {
    const map = {
        total_revenue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        },
        total_orders: {
            bg: 'bg-violet-50',
            text: 'text-violet-600',
            icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
        },
        total_products: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
        },
        total_customers: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
        },
    };
    return map[key] ?? map.total_orders;
}

function statusClass(status) {
    const map = {
        delivered: 'bg-emerald-100 text-emerald-700',
        processing: 'bg-blue-100 text-blue-700',
        pending: 'bg-amber-100 text-amber-700',
        cancelled: 'bg-red-100 text-red-700',
        confirmed: 'bg-indigo-100 text-indigo-700',
        shipped: 'bg-cyan-100 text-cyan-700',
    };
    return map[String(status || '').toLowerCase()] ?? 'bg-slate-100 text-slate-700';
}
</script>
