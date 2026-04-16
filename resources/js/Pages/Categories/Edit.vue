<template>
    <AppLayout>
        <!-- Page header -->
        <div class="mb-6">
            <Link href="/categories" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Categories
            </Link>
            <h1 class="text-2xl font-bold text-slate-800">Edit Category</h1>
            <p class="text-slate-500 text-sm mt-1">Update category details</p>
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

            <!-- Form -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl">
                <form @submit.prevent="handleSubmit" class="space-y-5">
                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Category Name <span class="text-red-500">*</span></label>
                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="e.g. Electronics"
                            class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            :class="errors.name ? 'border-red-400' : 'border-slate-200'"
                        />
                        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name[0] }}</p>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                        <textarea
                            v-model="form.description"
                            rows="3"
                            placeholder="Brief description of the category"
                            class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                            :class="errors.description ? 'border-red-400' : 'border-slate-200'"
                        ></textarea>
                        <p v-if="errors.description" class="mt-1 text-xs text-red-500">{{ errors.description[0] }}</p>
                    </div>

                    <!-- Image -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Image</label>
                        <div
                            class="border-2 border-dashed rounded-xl p-6 text-center transition-colors"
                            :class="errors.image ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-blue-400'"
                        >
                            <div v-if="imagePreview || existingImage" class="mb-4">
                                <img
                                    :src="imagePreview ?? existingImage"
                                    class="w-24 h-24 rounded-lg object-cover mx-auto border border-slate-200"
                                />
                                <p v-if="!imagePreview && existingImage" class="text-xs text-slate-400 mt-2">Current image</p>
                            </div>
                            <label class="cursor-pointer">
                                <span class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ (imagePreview || existingImage) ? 'Change Image' : 'Choose Image' }}
                                </span>
                                <input type="file" class="hidden" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" @change="handleImageChange" />
                            </label>
                            <p class="text-xs text-slate-400 mt-2">JPEG, PNG, GIF, or WebP. Max 2MB. Old image is replaced on upload.</p>
                        </div>
                        <p v-if="errors.image" class="mt-1 text-xs text-red-500">{{ errors.image[0] }}</p>
                    </div>

                    <!-- Status & Sort -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                            <select
                                v-model="form.is_active"
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Sort Order</label>
                            <input
                                v-model.number="form.sort_order"
                                type="number"
                                min="0"
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                :class="errors.sort_order ? 'border-red-400' : 'border-slate-200'"
                            />
                            <p v-if="errors.sort_order" class="mt-1 text-xs text-red-500">{{ errors.sort_order[0] }}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            :disabled="processing"
                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <svg v-if="processing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {{ processing ? 'Saving…' : 'Update Category' }}
                        </button>
                        <Link
                            href="/categories"
                            class="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </template>
    </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useCategory } from '@/Composables/useCategory';

const page = usePage();
const categoryId = page.props.categoryId;

const { category, errors, processing, fetchCategory, updateCategory } = useCategory();

const loading = ref(true);
const existingImage = ref(null);
const imagePreview = ref(null);

const form = ref({
    name: '',
    description: '',
    image: null,
    is_active: true,
    sort_order: 0,
});

onMounted(async () => {
    await fetchCategory(categoryId);
    if (category.value) {
        form.value.name = category.value.name ?? '';
        form.value.description = category.value.description ?? '';
        form.value.is_active = Boolean(category.value.is_active);
        form.value.sort_order = category.value.sort_order ?? 0;
        existingImage.value = category.value.image ?? null;
    }
    loading.value = false;
});

function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
        form.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
    }
}

async function handleSubmit() {
    await updateCategory(categoryId, form.value);
}
</script>
