<template>
    <AppLayout>
        <!-- Page header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Hero Banners</h1>
                <p class="text-slate-500 text-sm mt-1">Manage your homepage hero banners</p>
            </div>
            <Link
                href="/hero-banners/create"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Banner
            </Link>
        </div>

        <!-- Loading -->
        <div v-if="processing && banners.length === 0" class="flex items-center justify-center py-20">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <!-- Empty state -->
        <div
            v-else-if="!processing && banners.length === 0"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
        >
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 mb-1">No hero banners yet</h3>
            <p class="text-slate-500 text-sm mb-6">Get started by creating your first hero banner.</p>
            <Link
                href="/hero-banners/create"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Banner
            </Link>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 text-left">
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Banner</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Badge</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Sort</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="item in banners" :key="item.id" class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-3.5">
                                <img
                                    v-if="item.banner_img"
                                    :src="item.banner_img"
                                    :alt="item.title"
                                    class="w-20 h-12 rounded-lg object-cover border border-slate-200"
                                />
                                <div v-else class="w-20 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <p class="font-medium text-slate-800">{{ item.title }}</p>
                                <p v-if="item.subtitle" class="text-xs text-slate-400 mt-0.5 line-clamp-1">{{ item.subtitle }}</p>
                            </td>
                            <td class="px-6 py-3.5 text-slate-500 hidden md:table-cell">{{ item.badge_txt || '—' }}</td>
                            <td class="px-6 py-3.5">
                                <button
                                    @click="handleToggleActive(item)"
                                    :disabled="togglingId === item.id"
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
                                    :class="item.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'"
                                    :title="item.is_active ? 'Click to deactivate' : 'Click to activate'"
                                >
                                    {{ item.is_active ? 'Active' : 'Inactive' }}
                                </button>
                            </td>
                            <td class="px-6 py-3.5 text-slate-500 hidden sm:table-cell">{{ item.sort_order }}</td>
                            <td class="px-6 py-3.5 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Link
                                        :href="`/hero-banners/${item.id}/edit`"
                                        class="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Link>
                                    <button
                                        @click="confirmDelete(item)"
                                        class="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div
                v-if="pagination.last_page > 1"
                class="flex items-center justify-between px-6 py-4 border-t border-slate-100"
            >
                <p class="text-sm text-slate-500">
                    Showing {{ pagination.from }}–{{ pagination.to }} of {{ pagination.total }}
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

        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/50" @click="showDeleteModal = false"></div>
                <div class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                    <h3 class="text-lg font-semibold text-slate-800 mb-2">Delete Hero Banner</h3>
                    <p class="text-sm text-slate-500 mb-6">
                        Are you sure you want to delete <strong>{{ deletingBanner?.title }}</strong>? This action cannot be undone.
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
import { ref, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useHeroBanner } from '@/Composables/useHeroBanner';

const {
    banners,
    pagination,
    processing,
    fetchBanners,
    deleteBanner,
    toggleActive,
} = useHeroBanner();

const showDeleteModal = ref(false);
const deletingBanner = ref(null);
const togglingId = ref(null);

onMounted(() => {
    fetchBanners();
});

function goToPage(page) {
    fetchBanners(page);
}

function confirmDelete(item) {
    deletingBanner.value = item;
    showDeleteModal.value = true;
}

async function handleDelete() {
    const success = await deleteBanner(deletingBanner.value.id);
    showDeleteModal.value = false;
    deletingBanner.value = null;
    if (success) {
        fetchBanners(pagination.value.current_page ?? 1);
    }
}

async function handleToggleActive(item) {
    togglingId.value = item.id;
    const updated = await toggleActive(item.id);
    if (updated) {
        item.is_active = updated.is_active;
    }
    togglingId.value = null;
}
</script>
