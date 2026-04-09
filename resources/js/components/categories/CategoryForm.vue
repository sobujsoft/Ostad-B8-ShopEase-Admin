<script setup lang="ts">
import { ref, watch } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { Category } from '@/types/category';

const props = defineProps<{
    category?: Category;
    errors: Record<string, string>;
    processing: boolean;
}>();

const emit = defineEmits<{
    submit: [formData: FormData];
}>();

const name = ref(props.category?.name ?? '');
const description = ref(props.category?.description ?? '');
const isActive = ref(props.category?.is_active !== false ? '1' : '0');
const sortOrder = ref(String(props.category?.sort_order ?? 0));
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(props.category?.image ?? null);

watch(
    () => props.category,
    (cat) => {
        if (cat) {
            name.value = cat.name;
            description.value = cat.description ?? '';
            isActive.value = cat.is_active ? '1' : '0';
            sortOrder.value = String(cat.sort_order);
            imagePreview.value = cat.image ?? null;
        }
    },
);

function handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
}

function removeImage() {
    imageFile.value = null;
    imagePreview.value = null;
}

function handleSubmit() {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('description', description.value);
    formData.append('is_active', isActive.value);
    formData.append('sort_order', sortOrder.value);
    if (imageFile.value) {
        formData.append('image', imageFile.value);
    }
    emit('submit', formData);
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid gap-6 sm:grid-cols-2">
            <div class="space-y-2 sm:col-span-2">
                <Label for="name">Category Name <span class="text-destructive">*</span></Label>
                <Input
                    id="name"
                    v-model="name"
                    type="text"
                    required
                    placeholder="e.g. Electronics"
                />
                <InputError :message="errors.name" />
            </div>

            <div class="space-y-2 sm:col-span-2">
                <Label for="description">Description</Label>
                <textarea
                    id="description"
                    v-model="description"
                    rows="3"
                    placeholder="Brief description of this category"
                    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                />
                <InputError :message="errors.description" />
            </div>

            <div class="space-y-2">
                <Label for="is_active">Status</Label>
                <Select v-model="isActive">
                    <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <InputError :message="errors.is_active" />
            </div>

            <div class="space-y-2">
                <Label for="sort_order">Sort Order</Label>
                <Input
                    id="sort_order"
                    v-model="sortOrder"
                    type="number"
                    min="0"
                    placeholder="0"
                />
                <InputError :message="errors.sort_order" />
            </div>

            <div class="space-y-2 sm:col-span-2">
                <Label>Category Image</Label>
                <div
                    v-if="imagePreview"
                    class="relative inline-block"
                >
                    <img
                        :src="imagePreview"
                        alt="Category preview"
                        class="h-32 w-32 rounded-lg border object-cover"
                    />
                    <button
                        type="button"
                        @click="removeImage"
                        class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white text-xs hover:bg-destructive/90"
                    >
                        &times;
                    </button>
                </div>
                <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    @change="handleImageChange"
                    class="cursor-pointer"
                />
                <p class="text-xs text-muted-foreground">
                    Accepted: JPEG, PNG, GIF, WebP. Max 2MB.
                </p>
                <InputError :message="errors.image" />
            </div>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t">
            <Button type="submit" :disabled="processing">
                <Spinner v-if="processing" />
                {{ category ? 'Update Category' : 'Create Category' }}
            </Button>
            <RouterLink to="/categories">
                <Button type="button" variant="outline">Cancel</Button>
            </RouterLink>
        </div>
    </form>
</template>
