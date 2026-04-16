<template>
    <AppLayout>
        <div class="mb-6">
            <Link href="/products" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
            </Link>
            <h1 class="text-2xl font-bold text-slate-800">Edit Product</h1>
            <p class="text-slate-500 text-sm mt-1">Update product details and manage images</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <template v-else>
            <!-- General error -->
            <div v-if="errors.general" class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {{ errors.general }}
            </div>

            <!-- Product Images Section -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 max-w-4xl">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-slate-800">Product Images</h2>
                    <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Image
                        <input type="file" class="hidden" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" @change="handleImageUpload" :disabled="imageProcessing" />
                    </label>
                </div>

                <!-- Upload progress -->
                <div v-if="imageProcessing" class="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 text-sm flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing image…
                </div>

                <!-- Image validation error -->
                <div v-if="errors.image" class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {{ errors.image[0] }}
                </div>

                <!-- Image Gallery -->
                <div v-if="productImages.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div
                        v-for="img in productImages"
                        :key="img.id"
                        class="relative group rounded-xl border-2 overflow-hidden transition-colors"
                        :class="img.is_primary ? 'border-blue-500 shadow-md shadow-blue-500/20' : 'border-slate-200'"
                    >
                        <img :src="img.image_path" class="w-full aspect-square object-cover" />

                        <!-- Primary badge -->
                        <div v-if="img.is_primary" class="absolute top-2 left-2">
                            <span class="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow">Primary</span>
                        </div>

                        <!-- Hover overlay -->
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button
                                v-if="!img.is_primary"
                                @click="handleSetPrimary(img)"
                                class="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50 transition-colors shadow"
                                title="Set as primary"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </button>
                            <button
                                @click="handleDeleteImage(img)"
                                class="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors shadow"
                                title="Delete image"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- No images -->
                <div v-else class="text-center py-8 text-slate-400">
                    <svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-sm">No images uploaded yet. Click "Upload Image" to add product photos.</p>
                </div>
            </div>

            <!-- Product Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6 max-w-4xl">
                <!-- Basic Information -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 class="text-lg font-semibold text-slate-800 mb-4">Basic Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Category <span class="text-red-500">*</span></label>
                            <select v-model="form.category_id"
                                class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                :class="errors.category_id ? 'border-red-400' : 'border-slate-200'">
                                <option value="">Select a category</option>
                                <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
                            <p v-if="errors.category_id" class="mt-1 text-xs text-red-500">{{ errors.category_id[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Product Name <span class="text-red-500">*</span></label>
                            <input v-model="form.name" type="text" placeholder="e.g. Wireless Headphones"
                                class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                :class="errors.name ? 'border-red-400' : 'border-slate-200'" />
                            <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Product Code <span class="text-red-500">*</span></label>
                            <input v-model="form.code" type="text" placeholder="e.g. WBH-001" maxlength="50"
                                class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                :class="errors.code ? 'border-red-400' : 'border-slate-200'" />
                            <p v-if="errors.code" class="mt-1 text-xs text-red-500">{{ errors.code[0] }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Color</label>
                            <input v-model="form.color" type="text" placeholder="e.g. Black"
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
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
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">
                            Short Description
                            <span class="text-slate-400 font-normal">({{ (form.short_description ?? '').length }}/500)</span>
                        </label>
                        <textarea v-model="form.short_description" rows="2" maxlength="500"
                            placeholder="Brief product summary"
                            class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                            :class="errors.short_description ? 'border-red-400' : 'border-slate-200'"></textarea>
                        <p v-if="errors.short_description" class="mt-1 text-xs text-red-500">{{ errors.short_description[0] }}</p>
                    </div>
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
                            <input v-model="form.meta_title" type="text" maxlength="70" placeholder="SEO title"
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">
                                Meta Description
                                <span class="text-slate-400 font-normal">({{ (form.meta_description ?? '').length }}/160)</span>
                            </label>
                            <textarea v-model="form.meta_description" rows="2" maxlength="160" placeholder="Brief SEO description"
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
                        {{ processing ? 'Saving…' : 'Update Product' }}
                    </button>
                    <Link href="/products" class="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                        Cancel
                    </Link>
                </div>
            </form>
        </template>
    </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useProduct } from '@/Composables/useProduct';
import { useCategory } from '@/Composables/useCategory';

const page = usePage();
const productId = page.props.productId;

const {
    product,
    errors,
    processing,
    imageProcessing,
    fetchProduct,
    updateProduct,
    uploadProductImage,
    updateProductImage,
    deleteProductImage,
} = useProduct();

const { categories: categoryList, fetchCategories } = useCategory();

const loading = ref(true);
const productImages = ref([]);

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

onMounted(async () => {
    await Promise.all([fetchProduct(productId), fetchCategories()]);

    if (product.value) {
        const p = product.value;
        form.value = {
            category_id: p.category_id ?? '',
            name: p.name ?? '',
            code: p.code ?? '',
            color: p.color ?? '',
            size: p.size ?? '',
            short_description: p.short_description ?? '',
            description: p.description ?? '',
            price: p.price ?? '',
            discount_price: p.discount_price ?? '',
            stock_status: p.stock_status ?? 'in_stock',
            is_active: Boolean(p.is_active),
            meta_title: p.meta_title ?? '',
            meta_description: p.meta_description ?? '',
        };
        productImages.value = p.images ?? [];
    }

    loading.value = false;
});

async function handleSubmit() {
    await updateProduct(productId, form.value);
}

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    const isPrimary = productImages.value.length === 0;
    const result = await uploadProductImage(productId, file, isPrimary);
    if (result) {
        await refreshImages();
    }
}

async function handleSetPrimary(img) {
    const success = await updateProductImage(productId, img.id, { is_primary: true });
    if (success) await refreshImages();
}

async function handleDeleteImage(img) {
    const success = await deleteProductImage(productId, img.id);
    if (success) await refreshImages();
}

async function refreshImages() {
    await fetchProduct(productId);
    if (product.value) {
        productImages.value = product.value.images ?? [];
    }
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
