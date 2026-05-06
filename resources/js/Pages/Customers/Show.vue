<template>
    <AppLayout>
        <div class="mb-6">
            <Link
                href="/customers"
                class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Customers
            </Link>
        </div>

        <div v-if="processing && !customer" class="flex items-center justify-center py-20">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <div v-else-if="!customer" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <h3 class="text-lg font-semibold text-slate-800 mb-1">Customer not found</h3>
            <p class="text-slate-500 text-sm">The customer may have been deleted.</p>
        </div>

        <div v-else class="space-y-4">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">{{ customer.user?.name ?? customer.name ?? 'N/A' }}</h1>
                        <p class="text-slate-500 text-sm mt-1">{{ customer.user?.email ?? customer.email ?? 'N/A' }}</p>
                    </div>
                    <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        :class="isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                    >
                        {{ isActive ? 'Active' : 'Inactive' }}
                    </span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Customer Info</h3>
                    <dl class="space-y-3">
                        <div class="flex items-center justify-between gap-4">
                            <dt class="text-sm text-slate-500">Phone</dt>
                            <dd class="text-sm font-medium text-slate-800">{{ customer.phone ?? customer.user?.phone ?? 'N/A' }}</dd>
                        </div>
                        <div class="flex items-center justify-between gap-4">
                            <dt class="text-sm text-slate-500">Joined</dt>
                            <dd class="text-sm font-medium text-slate-800">{{ formatDate(customer.created_at) }}</dd>
                        </div>
                        <div class="flex items-center justify-between gap-4">
                            <dt class="text-sm text-slate-500">Updated</dt>
                            <dd class="text-sm font-medium text-slate-800">{{ formatDate(customer.updated_at) }}</dd>
                        </div>
                    </dl>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Order Stats</h3>
                    <dl class="space-y-3">
                        <div class="flex items-center justify-between gap-4">
                            <dt class="text-sm text-slate-500">Total Orders</dt>
                            <dd class="text-sm font-semibold text-slate-800">{{ customer.total_orders ?? 0 }}</dd>
                        </div>
                        <div class="flex items-center justify-between gap-4">
                            <dt class="text-sm text-slate-500">Total Spent</dt>
                            <dd class="text-sm font-semibold text-slate-800">{{ money(customer.total_spent) }}</dd>
                        </div>
                        <div class="flex items-center justify-between gap-4">
                            <dt class="text-sm text-slate-500">Last Order</dt>
                            <dd class="text-sm font-semibold text-slate-800">{{ formatDate(customer.last_order_at) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useCustomer } from '@/Composables/useCustomer';

const props = defineProps({
    customerId: {
        type: [String, Number],
        required: true,
    },
});

const { customer, processing, fetchCustomer } = useCustomer();

const isActive = computed(() => Boolean(customer.value?.is_active ?? customer.value?.user?.is_active));

onMounted(() => {
    fetchCustomer(props.customerId);
});

function formatDate(value) {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString();
}

function money(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}
</script>
