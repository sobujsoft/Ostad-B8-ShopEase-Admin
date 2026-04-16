<template>
    <AppLayout>
        <!-- Page header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Products</h1>
                <p class="text-slate-500 text-sm mt-1">Manage your product catalog</p>
            </div>
            <Link
                href="/products/create"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
            </Link>
        </div>

        <!-- Loading -->
        <div v-if="processing && products.length === 0" class="flex items-center justify-center py-20">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <!-- Empty state -->
        <div
            v-else-if="!processing && products.length === 0"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
        >
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 mb-1">No products yet</h3>
            <p class="text-slate-500 text-sm mb-6">Get started by creating your first product.</p>
            <Link
                href="/products/create"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
            </Link>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 text-left">
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Code</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Stock</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                            <th class="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="prod in products" :key="prod.id" class="hover:bg-slate-50 transition-colors">
                            <!-- Product info + image -->
                            <td class="px-6 py-3.5">
                                <div class="flex items-center gap-3">
                                    <img
                                        v-if="primaryImage(prod)"
                                        :src="primaryImage(prod)"
                                        :alt="prod.name"
                                        class="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                    />
                                    <div v-else class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="font-medium text-slate-800 truncate">{{ prod.name }}</p>
                                        <p class="text-xs text-slate-400 truncate">{{ prod.category?.name ?? '—' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-3.5 text-slate-500 hidden lg:table-cell font-mono text-xs">{{ prod.code }}</td>
                            <td class="px-6 py-3.5">
                                <p class="font-semibold text-slate-800">${{ formatPrice(prod.price) }}</p>
                                <p v-if="prod.discount_price" class="text-xs text-emerald-600">${{ formatPrice(prod.discount_price) }}</p>
                            </td>
                            <!-- Stock toggle -->
                            <td class="px-6 py-3.5 hidden md:table-cell">
                                <button
                                    @click="handleToggleStock(prod)"
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
                                    :class="prod.stock_status === 'in_stock'
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'"
                                    :title="'Click to toggle stock status'"
                                >
                                    {{ prod.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock' }}
                                </button>
                            </td>
                            <!-- Active toggle -->
                            <td class="px-6 py-3.5 hidden sm:table-cell">
                                <button
                                    @click="handleToggleActive(prod)"
                                    class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                                    :class="prod.is_active ? 'bg-blue-600' : 'bg-slate-300'"
                                    :title="prod.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'"
                                >
                                    <span
                                        class="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm"
                                        :class="prod.is_active ? 'translate-x-4.5' : 'translate-x-0.5'"
                                    />
                                </button>
                            </td>
                            <!-- Actions -->
                            <td class="px-6 py-3.5 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Link
                                        :href="`/products/${prod.id}/edit`"
                                        class="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Link>
                                    <button
                                        @click="confirmDelete(prod)"
                                        class="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

        <!-- Delete Modal -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/50" @click="showDeleteModal = false"></div>
                <div class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                    <h3 class="text-lg font-semibold text-slate-800 mb-2">Delete Product</h3>
                    <p class="text-sm text-slate-500 mb-6">
                        Are you sure you want to delete <strong>{{ deletingProduct?.name }}</strong>? All associated images will also be removed.
                    </p>
                    <div class="flex items-center justify-end gap-3">
                        <button
                            @click="showDeleteModal = false"
                            class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >Cancel</button>
                        <button
                            @click="handleDelete"
                            :disabled="processing"
                            class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-60 rounded-xl transition-colors"
                        >{{ processing ? 'Deleting…' : 'Delete' }}</button>
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
import { useProduct } from '@/Composables/useProduct';

const {
    products,
    pagination,
    processing,
    fetchProducts,
    deleteProduct,
    toggleActive,
    toggleStock,
} = useProduct();

const showDeleteModal = ref(false);
const deletingProduct = ref(null);

onMounted(() => fetchProducts());

function goToPage(page) {
    fetchProducts(page);
}

function primaryImage(prod) {
    if (!prod.images?.length) return null;
    const primary = prod.images.find((i) => i.is_primary);
    return (primary ?? prod.images[0])?.image_path ?? null;
}

function formatPrice(val) {
    return Number(val).toFixed(2);
}

async function handleToggleActive(prod) {
    const updated = await toggleActive(prod.id);
    if (updated) prod.is_active = updated.is_active;
}

async function handleToggleStock(prod) {
    const updated = await toggleStock(prod.id);
    if (updated) prod.stock_status = updated.stock_status;
}

function confirmDelete(prod) {
    deletingProduct.value = prod;
    showDeleteModal.value = true;
}

async function handleDelete() {
    const success = await deleteProduct(deletingProduct.value.id);
    showDeleteModal.value = false;
    deletingProduct.value = null;
    if (success) fetchProducts(pagination.value.current_page ?? 1);
}
</script>
