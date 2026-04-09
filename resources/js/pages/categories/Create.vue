<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import CategoryForm from '@/components/categories/CategoryForm.vue';
import { categoryService } from '@/services/categoryService';

const router = useRouter();
const errors = ref<Record<string, string>>({});
const processing = ref(false);

async function handleSubmit(formData: FormData) {
    errors.value = {};
    processing.value = true;

    try {
        const response = await categoryService.create(formData);
        toast.success(response.message || 'Category created successfully.');
        router.push('/categories');
    } catch (error: any) {
        if (error.response?.status === 422) {
            const serverErrors = error.response.data.errors ?? {};
            for (const [key, messages] of Object.entries(serverErrors)) {
                errors.value[key] = (messages as string[])[0];
            }
        } else {
            toast.error(
                error.response?.data?.message || 'Failed to create category.',
            );
        }
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <div class="space-y-6 p-6">
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">
                Create Category
            </h1>
            <p class="text-sm text-muted-foreground">
                Add a new product category
            </p>
        </div>

        <div class="max-w-2xl rounded-lg border p-6">
            <CategoryForm
                :errors="errors"
                :processing="processing"
                @submit="handleSubmit"
            />
        </div>
    </div>
</template>
