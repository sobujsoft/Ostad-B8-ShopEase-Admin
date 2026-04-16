<template>
    <AppLayout>
        <div class="mb-6">
            <Link href="/products" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
            </Link>
            <h1 class="text-2xl font-bold text-slate-800">Create Product</h1>
            <p class="text-slate-500 text-sm mt-1">Add a new product to your catalog. You can upload images after creation.</p>
        </div>

        <!-- General error -->
        <div v-if="errors.general" class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {{ errors.general }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6 max-w-4xl">
            <!-- Basic Information -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 class="text-lg font-semibold text-slate-800 mb-4">Basic Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- Category -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Category <span class="text-red-500">*</span></label>
                        <select
                            v-model="form.category_id"
                            class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            :class="errors.category_id ? 'border-red-400' : 'border-slate-200'"
                        >
                            <option value="">Select a category</option>
                            <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                        <p v-if="errors.category_id" class="mt-1 text-xs text-red-500">{{ errors.category_id[0] }}</p>
                    </div>
                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Product Name <span class="text-red-500">*</span></label>
                        <input v-model="form.name" type="text" placeholder="e.g. Wireless Headphones"
                            class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            :class="errors.name ? 'border-red-400' : 'border-slate-200'" />
                        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name[0] }}</p>
                    </div>
                    <!-- Code -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Product Code <span class="text-red-500">*</span></label>
                        <input v-model="form.code" type="text" placeholder="e.g. WBH-001" maxlength="50"
                            class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            :class="errors.code ? 'border-red-400' : 'border-slate-200'" />
                        <p v-if="errors.code" class="mt-1 text-xs text-red-500">{{ errors.code[0] }}</p>
                    </div>
                    <!-- Color -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Color</label>
                        <input v-model="form.color" type="text" placeholder="e.g. Black"
                            class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <!-- Size -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Size</label>
                        <input v-model="form.size" type="text" placeholder="e.g. One Size"
                            class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 class="text-lg font-semibold text-slate-800 mb-4">Description</h2>
                <!-- Short Description -->
                <div class="mb-5">
                    <label class="block text-sm font-medium text-slate-700 mb-1.5">
                        Short Description
                        <span class="text-slate-400 font-normal">({{ (form.short_description ?? '').length }}/500)</span>
                    </label>
                    <textarea v-model="form.short_description" rows="2" maxlength="500"
                        placeholder="Brief product summary shown in listings"
                        class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                        :class="errors.short_description ? 'border-red-400' : 'border-slate-200'"></textarea>
                    <p v-if="errors.short_description" class="mt-1 text-xs text-red-500">{{ errors.short_description[0] }}</p>
                </div>
                <!-- Full Description (Rich Text) -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Description</label>
                    <div class="quill-wrapper" :class="errors.description ? 'quill-error' : ''">
                        <QuillEditor
                            v-model:content="form.description"
                            contentType="html"
                            theme="snow"
                            :toolbar="toolbarOptions"
                            placeholder="Detailed product description..."
                            style="min-height: 200px"
                        />
                    </div>
                    <p v-if="errors.description" class="mt-1 text-xs text-red-500">{{ errors.description[0] }}</p>
                </div>
            </div>

            <!-- Pricing -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 class="text-lg font-semibold text-slate-800 mb-4">Pricing</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Price <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                            <input v-model="form.price" type="number" step="0.01" min="0" placeholder="0.00"
                                class="w-full pl-8 pr-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                :class="errors.price ? 'border-red-400' : 'border-slate-200'" />
                        </div>
                        <p v-if="errors.price" class="mt-1 text-xs text-red-500">{{ errors.price[0] }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Discount Price</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                            <input v-model="form.discount_price" type="number" step="0.01" min="0" placeholder="0.00"
                                class="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <p v-if="errors.discount_price" class="mt-1 text-xs text-red-500">{{ errors.discount_price[0] }}</p>
                    </div>
                </div>
            </div>

            <!-- Settings -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 class="text-lg font-semibold text-slate-800 mb-4">Settings</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Stock Status</label>
                        <select v-model="form.stock_status"
                            class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                        <select v-model="form.is_active"
                            class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                            <option :value="true">Active</option>
                            <option :value="false">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SEO -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 class="text-lg font-semibold text-slate-800 mb-4">SEO</h2>
                <div class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">
                            Meta Title
                            <span class="text-slate-400 font-normal">({{ (form.meta_title ?? '').length }}/70)</span>
                        </label>
                        <input v-model="form.meta_title" type="text" maxlength="70" placeholder="SEO title for search engines"
                            class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">
                            Meta Description
                            <span class="text-slate-400 font-normal">({{ (form.meta_description ?? '').length }}/160)</span>
                        </label>
                        <textarea v-model="form.meta_description" rows="2" maxlength="160"
                            placeholder="Brief description for search engine results"
                            class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3">
                <button type="submit" :disabled="processing"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                    <svg v-if="processing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {{ processing ? 'Saving…' : 'Create Product' }}
                </button>
                <Link href="/products" class="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                    Cancel
                </Link>
            </div>
        </form>
    </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useProduct } from '@/Composables/useProduct';
import { useCategory } from '@/Composables/useCategory';

const { errors, processing, storeProduct } = useProduct();
const { categories: categoryList, fetchCategories } = useCategory();

onMounted(() => fetchCategories());

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: [2, 3, 4, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
];

const form = ref({
    category_id: '',
    name: '',
    code: '',
    color: '',
    size: '',
    short_description: '',
    description: '',
    price: '',
    discount_price: '',
    stock_status: 'in_stock',
    is_active: true,
    meta_title: '',
    meta_description: '',
});

async function handleSubmit() {
    await storeProduct(form.value);
}
</script>

<style scoped>
.quill-wrapper :deep(.ql-container) {
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    font-size: 0.875rem;
}
.quill-wrapper :deep(.ql-toolbar) {
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    background: #f8fafc;
}
.quill-wrapper :deep(.ql-editor) {
    min-height: 200px;
}
.quill-error :deep(.ql-toolbar),
.quill-error :deep(.ql-container) {
    border-color: #f87171;
}
</style>
