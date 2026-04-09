<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import CategoryForm from '@/components/categories/CategoryForm.vue';
import { Spinner } from '@/components/ui/spinner';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/types/category';

const route = useRoute();
const router = useRouter();

const category = ref<Category | undefined>(undefined);
const loading = ref(true);
const errors = ref<Record<string, string>>({});
const processing = ref(false);

async function fetchCategory() {
    const id = Number(route.params.id);
    loading.value = true;
    try {
        const response = await categoryService.show(id);
        category.value = response.data;
    } catch {
        toast.error('Category not found.');
        router.push('/categories');
    } finally {
        loading.value = false;
    }
}

async function handleSubmit(formData: FormData) {
    if (!category.value) return;
    errors.value = {};
    processing.value = true;

    try {
        const response = await categoryService.update(
            category.value.id,
            formData,
        );
        toast.success(response.message || 'Category updated successfully.');
        router.push('/categories');
    } catch (error: any) {
        if (error.response?.status === 422) {
            const serverErrors = error.response.data.errors ?? {};
            for (const [key, messages] of Object.entries(serverErrors)) {
                errors.value[key] = (messages as string[])[0];
            }
        } else {
            toast.error(
                error.response?.data?.message || 'Failed to update category.',
            );
        }
    } finally {
        processing.value = false;
    }
}

onMounted(() => fetchCategory());
</script>

<template>
    <div class="space-y-6 p-6">
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">
                Edit Category
            </h1>
            <p class="text-sm text-muted-foreground">
                Update category details
            </p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20">
            <Spinner class="h-8 w-8" />
        </div>

        <div v-else class="max-w-2xl rounded-lg border p-6">
            <CategoryForm
                :category="category"
                :errors="errors"
                :processing="processing"
                @submit="handleSubmit"
            />
        </div>
    </div>
</template>
