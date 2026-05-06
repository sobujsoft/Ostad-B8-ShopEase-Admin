<template>
    <AppLayout>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Customers</h1>
                <p class="text-slate-500 text-sm mt-1">Browse and manage customer accounts</p>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                    v-model="filters.search"
                    type="text"
                    placeholder="Search name, email, phone..."
                    class="md:col-span-2 w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <select
                    v-model="filters.is_active"
                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">All status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
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

        <div v-if="processing && customers.length === 0" class="flex items-center justify-center py-20">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <div
            v-else-if="!processing && customers.length === 0"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
        >
            <h3 class="text-lg font-semibold text-slate-800 mb-1">No customers found</h3>
            <p class="text-slate-500 text-sm">Try adjusting your filters.</p>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 text-left">
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Joined</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="item in customers" :key="item.id" class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-3.5">
                                <p class="font-medium text-slate-800">{{ item.user?.name ?? item.name ?? 'N/A' }}</p>
                                <p class="text-xs text-slate-500">{{ item.user?.email ?? item.email ?? 'N/A' }}</p>
                            </td>
                            <td class="px-6 py-3.5 text-slate-500 hidden lg:table-cell">{{ item.phone ?? item.user?.phone ?? 'N/A' }}</td>
                            <td class="px-6 py-3.5">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="isActive(item) ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                                >
                                    {{ isActive(item) ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="px-6 py-3.5 text-slate-500 hidden xl:table-cell">{{ formatDate(item.created_at) }}</td>
                            <td class="px-6 py-3.5 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Link
                                        :href="`/customers/${item.id}`"
                                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        View
                                    </Link>
                                    <button
                                        @click="toggle(item)"
                                        :disabled="processing"
                                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50"
                                    >
                                        Toggle
                                    </button>
                                    <button
                                        @click="confirmDelete(item)"
                                        :disabled="processing"
                                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
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

        <Teleport to="body">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/50" @click="showDeleteModal = false"></div>
                <div class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                    <h3 class="text-lg font-semibold text-slate-800 mb-2">Delete Customer</h3>
                    <p class="text-sm text-slate-500 mb-6">
                        Delete <strong>{{ deletingCustomer?.user?.name ?? deletingCustomer?.name }}</strong>? This action cannot be undone.
                    </p>
                    <div class="flex items-center justify-end gap-3">
                        <button
                            @click="showDeleteModal = false"
                            class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="handleDelete"
                            :disabled="processing"
                            class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-60 rounded-xl transition-colors"
                        >
                            {{ processing ? 'Deleting…' : 'Delete' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </AppLayout>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useCustomer } from '@/Composables/useCustomer';

const { customers, pagination, processing, fetchCustomers, toggleActive, deleteCustomer } = useCustomer();

const filters = ref({
    page: 1,
    per_page: 10,
    search: '',
    is_active: '',
});

const showDeleteModal = ref(false);
const deletingCustomer = ref(null);
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
    fetchCustomers(cleanParams());
}

function resetFilters() {
    filters.value = {
        page: 1,
        per_page: 10,
        search: '',
        is_active: '',
    };
    fetchCustomers(cleanParams());
}

function goToPage(page) {
    filters.value.page = page;
    fetchCustomers(cleanParams());
}

function formatDate(value) {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString();
}

function isActive(item) {
    return Boolean(item?.is_active ?? item?.user?.is_active);
}

async function toggle(item) {
    const ok = await toggleActive(item.id);
    if (ok) {
        fetchCustomers(cleanParams());
    }
}

function confirmDelete(item) {
    deletingCustomer.value = item;
    showDeleteModal.value = true;
}

async function handleDelete() {
    if (!deletingCustomer.value) return;
    const ok = await deleteCustomer(deletingCustomer.value.id);
    showDeleteModal.value = false;
    deletingCustomer.value = null;
    if (ok) {
        fetchCustomers(cleanParams());
    }
}

watch(
    () => [filters.value.is_active, filters.value.per_page],
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
