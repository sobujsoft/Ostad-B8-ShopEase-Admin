<template>
    <AppLayout>
        <!-- Page header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Product Sections</h1>
                <p class="text-slate-500 text-sm mt-1">Curate Best Sellers and New Arrivals sections (max 8 each)</p>
            </div>
            <button
                @click="openAssignModal"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Assign Products
            </button>
        </div>

        <!-- Section Tabs -->
        <div class="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-100 w-fit mb-6">
            <button
                v-for="sec in sectionOptions"
                :key="sec.value"
                @click="activeSection = sec.value"
                :class="[
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    activeSection === sec.value
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-600 hover:bg-slate-100',
                ]"
            >
                {{ sec.label }}
                <span
                    class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full"
                    :class="activeSection === sec.value ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'"
                >{{ (sections[sec.value] ?? []).length }}</span>
            </button>
        </div>

        <!-- Loading -->
        <div v-if="sectionLoading" class="flex items-center justify-center py-16">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <!-- Empty state -->
        <div
            v-else-if="currentProducts.length === 0"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
        >
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 mb-1">No products in this section</h3>
            <p class="text-slate-500 text-sm mb-6">Click "Assign Products" to add products to {{ activeSectionLabel }}.</p>
            <button
                @click="openAssignModal"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Assign Products
            </button>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
                v-for="(prod, idx) in currentProducts"
                :key="prod.pivot_id ?? prod.id"
                class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group"
            >
                <!-- Image -->
                <div class="aspect-square bg-slate-50 relative">
                    <img
                        v-if="primaryImage(prod)"
                        :src="primaryImage(prod)"
                        :alt="prod.name"
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <!-- Sort badge -->
                    <span class="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs font-semibold rounded-lg">
                        #{{ prod.sort_order ?? idx }}
                    </span>

                    <!-- Remove button -->
                    <button
                        @click="handleRemove(prod)"
                        class="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg shadow transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from section"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Info -->
                <div class="p-4">
                    <p class="font-medium text-slate-800 text-sm truncate">{{ prod.name }}</p>
                    <p class="text-xs text-slate-400 mt-0.5">{{ prod.code }}</p>
                    <div class="flex items-center justify-between mt-2">
                        <p class="font-semibold text-slate-800 text-sm">${{ formatPrice(prod.price) }}</p>
                        <span
                            class="px-2 py-0.5 rounded-full text-xs font-medium"
                            :class="prod.stock_status === 'in_stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                        >{{ prod.stock_status === 'in_stock' ? 'In Stock' : 'Out' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Assign Products Modal -->
        <Teleport to="body">
            <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/50" @click="showAssignModal = false"></div>
                <div class="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-slate-100 shrink-0">
                        <h3 class="text-lg font-semibold text-slate-800">Assign Products to Section</h3>
                        <p class="text-sm text-slate-500 mt-0.5">Select products and a section. Max 8 per section.</p>
                    </div>

                    <!-- Body -->
                    <div class="px-6 py-4 overflow-y-auto flex-1">
                        <!-- Errors -->
                        <div v-if="assignErrors.general" class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {{ assignErrors.general }}
                        </div>
                        <div v-if="assignErrors.product_id" class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {{ Array.isArray(assignErrors.product_id) ? assignErrors.product_id[0] : assignErrors.product_id }}
                        </div>

                        <!-- Section picker -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Section</label>
                            <select v-model="assignSection"
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <option v-for="sec in sectionOptions" :key="sec.value" :value="sec.value">{{ sec.label }}</option>
                            </select>
                        </div>

                        <!-- Search -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Search Products</label>
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Type to search by name or code..."
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <!-- Loading products -->
                        <div v-if="productsLoading" class="flex items-center justify-center py-8">
                            <svg class="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>

                        <!-- Product list -->
                        <div v-else class="space-y-2 max-h-64 overflow-y-auto">
                            <p v-if="filteredProducts.length === 0" class="text-sm text-slate-400 text-center py-4">No available products found.</p>
                            <label
                                v-for="prod in filteredProducts"
                                :key="prod.id"
                                class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                                :class="selectedIds.includes(prod.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'"
                            >
                                <input
                                    type="checkbox"
                                    :value="prod.id"
                                    v-model="selectedIds"
                                    class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <img
                                    v-if="primaryImageFromProd(prod)"
                                    :src="primaryImageFromProd(prod)"
                                    class="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div v-else class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-slate-800 truncate">{{ prod.name }}</p>
                                    <p class="text-xs text-slate-400">{{ prod.code }} &middot; ${{ formatPrice(prod.price) }}</p>
                                </div>
                            </label>
                        </div>

                        <!-- Selected count -->
                        <div v-if="selectedIds.length" class="mt-3 flex items-center gap-2">
                            <span class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{{ selectedIds.length }} selected</span>
                            <button @click="selectedIds = []" class="text-xs text-slate-500 hover:text-slate-700 transition-colors">Clear all</button>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                        <button
                            @click="showAssignModal = false"
                            class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >Cancel</button>
                        <button
                            @click="handleAssign"
                            :disabled="processing || selectedIds.length === 0"
                            class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-colors"
                        >
                            {{ processing ? 'Assigning…' : `Assign ${selectedIds.length || ''} Product${selectedIds.length > 1 ? 's' : ''}` }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Remove Confirmation Modal -->
        <Teleport to="body">
            <div v-if="showRemoveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/50" @click="showRemoveModal = false"></div>
                <div class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                    <h3 class="text-lg font-semibold text-slate-800 mb-2">Remove from Section</h3>
                    <p class="text-sm text-slate-500 mb-6">
                        Remove <strong>{{ removingProduct?.name }}</strong> from {{ activeSectionLabel }}? The product itself will not be deleted.
                    </p>
                    <div class="flex items-center justify-end gap-3">
                        <button @click="showRemoveModal = false" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                        <button @click="confirmRemove" :disabled="processing"
                            class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-60 rounded-xl transition-colors">
                            {{ processing ? 'Removing…' : 'Remove' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useSection } from '@/Composables/useSection';
import { useProduct } from '@/Composables/useProduct';

const {
    sections,
    processing,
    errors: sectionErrors,
    fetchAllSections,
    assignProducts,
    removeProduct,
} = useSection();

const {
    products: allProducts,
    processing: productsLoading,
    fetchProducts: fetchAllProducts,
} = useProduct();

const sectionOptions = [
    { value: 'best_sellers', label: 'Best Sellers' },
    { value: 'new_arrivals', label: 'New Arrivals' },
];

const activeSection = ref('best_sellers');
const sectionLoading = ref(true);

const showAssignModal = ref(false);
const assignSection = ref('best_sellers');
const searchQuery = ref('');
const selectedIds = ref([]);
const assignErrors = ref({});

const showRemoveModal = ref(false);
const removingProduct = ref(null);

const activeSectionLabel = computed(() => {
    return sectionOptions.find((s) => s.value === activeSection.value)?.label ?? '';
});

const currentProducts = computed(() => {
    return sections.value[activeSection.value] ?? [];
});

const assignedProductIds = computed(() => {
    const ids = new Set();
    Object.values(sections.value).forEach((prods) => {
        prods.forEach((p) => ids.add(p.id));
    });
    return ids;
});

const filteredProducts = computed(() => {
    const q = searchQuery.value.toLowerCase().trim();
    return allProducts.value.filter((p) => {
        if (assignedProductIds.value.has(p.id)) return false;
        if (!q) return true;
        return (
            (p.name ?? '').toLowerCase().includes(q) ||
            (p.code ?? '').toLowerCase().includes(q)
        );
    });
});

const productImageMap = computed(() => {
    const map = {};
    allProducts.value.forEach((p) => {
        if (!p.images?.length) return;
        const primary = p.images.find((i) => i.is_primary) ?? p.images[0];
        if (primary?.image_path) map[p.id] = primary.image_path;
    });
    return map;
});

onMounted(async () => {
    await Promise.all([fetchAllSections(), loadAllProducts()]);
    sectionLoading.value = false;
});

function primaryImage(prod) {
    if (prod.images?.length) {
        const primary = prod.images.find((i) => i.is_primary) ?? prod.images[0];
        if (primary?.image_path) return primary.image_path;
    }
    return productImageMap.value[prod.id] ?? null;
}

function primaryImageFromProd(prod) {
    return primaryImage(prod);
}

function formatPrice(val) {
    return Number(val).toFixed(2);
}

async function openAssignModal() {
    assignSection.value = activeSection.value;
    searchQuery.value = '';
    selectedIds.value = [];
    assignErrors.value = {};
    showAssignModal.value = true;
}

async function loadAllProducts() {
    let page = 1;
    let hasMore = true;
    const collected = [];
    while (hasMore) {
        await fetchAllProducts(page);
        collected.push(...allProducts.value);
        const pag = allProducts.value.length;
        if (pag < 15) hasMore = false;
        else page++;
        if (page > 20) break;
    }
    allProducts.value = collected;
}

async function handleAssign() {
    assignErrors.value = {};
    const sortOrders = selectedIds.value.map((_, i) => i);
    const success = await assignProducts(assignSection.value, selectedIds.value, sortOrders);

    if (success) {
        showAssignModal.value = false;
        selectedIds.value = [];
        sectionLoading.value = true;
        await fetchAllSections();
        sectionLoading.value = false;
    } else {
        assignErrors.value = sectionErrors.value;
    }
}

function handleRemove(prod) {
    removingProduct.value = prod;
    showRemoveModal.value = true;
}

async function confirmRemove() {
    const pivotId = removingProduct.value.pivot_id;
    const success = await removeProduct(activeSection.value, pivotId);
    showRemoveModal.value = false;
    removingProduct.value = null;
    if (success) {
        sectionLoading.value = true;
        await fetchAllSections();
        sectionLoading.value = false;
    }
}
</script>
