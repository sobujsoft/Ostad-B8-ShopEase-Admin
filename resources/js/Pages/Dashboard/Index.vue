<template>
    <AppLayout>
        <!-- Stats grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div
                v-for="stat in stats"
                :key="stat.label"
                class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-slate-500 text-sm font-medium">{{ stat.label }}</p>
                        <p class="text-2xl font-bold text-slate-800 mt-1">{{ stat.value }}</p>
                        <div class="flex items-center gap-1 mt-2">
                            <span
                                class="text-xs font-semibold"
                                :class="stat.trend > 0 ? 'text-emerald-600' : 'text-red-500'"
                            >
                                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                            </span>
                            <span class="text-xs text-slate-400">vs last month</span>
                        </div>
                    </div>
                    <div
                        class="w-11 h-11 rounded-xl flex items-center justify-center"
                        :class="stat.iconBg"
                    >
                        <span class="w-5 h-5" :class="stat.iconColor" v-html="stat.icon"></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Orders & Top Products -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <!-- Recent Orders -->
            <div class="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 class="font-semibold text-slate-800">Recent Orders</h3>
                    <button class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">View all</button>
                </div>
                <div class="overflow-x-auto">
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
                                <td class="px-6 py-3.5 font-medium text-slate-800">{{ order.id }}</td>
                                <td class="px-6 py-3.5 text-slate-600">{{ order.customer }}</td>
                                <td class="px-6 py-3.5 font-semibold text-slate-800">{{ order.amount }}</td>
                                <td class="px-6 py-3.5">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="statusClass(order.status)"
                                    >
                                        {{ order.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100">
                    <h3 class="font-semibold text-slate-800">Top Categories</h3>
                </div>
                <div class="p-6 space-y-4">
                    <div v-for="cat in topCategories" :key="cat.name">
                        <div class="flex items-center justify-between mb-1.5">
                            <span class="text-sm font-medium text-slate-700">{{ cat.name }}</span>
                            <span class="text-sm font-semibold text-slate-800">{{ cat.percent }}%</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-2">
                            <div
                                class="h-2 rounded-full transition-all duration-500"
                                :class="cat.color"
                                :style="{ width: cat.percent + '%' }"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';

const stats = [
    {
        label: 'Total Revenue',
        value: '$48,295',
        trend: 12.5,
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        label: 'Total Orders',
        value: '1,284',
        trend: 8.2,
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
    },
    {
        label: 'Total Products',
        value: '342',
        trend: 3.1,
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
    {
        label: 'Total Customers',
        value: '5,632',
        trend: -2.4,
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
];

const recentOrders = [
    { id: '#ORD-001', customer: 'Rahim Uddin', amount: '$120.00', status: 'Delivered' },
    { id: '#ORD-002', customer: 'Karim Ahmed', amount: '$85.50',  status: 'Processing' },
    { id: '#ORD-003', customer: 'Fatema Begum', amount: '$210.00', status: 'Pending' },
    { id: '#ORD-004', customer: 'Nusrat Jahan', amount: '$54.00',  status: 'Delivered' },
    { id: '#ORD-005', customer: 'Sohel Rana',   amount: '$330.00', status: 'Cancelled' },
];

const topCategories = [
    { name: 'Electronics',  percent: 72, color: 'bg-blue-500' },
    { name: 'Clothing',     percent: 55, color: 'bg-violet-500' },
    { name: 'Home & Garden', percent: 40, color: 'bg-amber-500' },
    { name: 'Books',        percent: 28, color: 'bg-emerald-500' },
    { name: 'Sports',       percent: 18, color: 'bg-rose-500' },
];

function statusClass(status) {
    const map = {
        Delivered:  'bg-emerald-100 text-emerald-700',
        Processing: 'bg-blue-100 text-blue-700',
        Pending:    'bg-amber-100 text-amber-700',
        Cancelled:  'bg-red-100 text-red-700',
    };
    return map[status] ?? 'bg-slate-100 text-slate-700';
}
</script>
