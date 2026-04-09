<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { categoryService } from '@/services/categoryService';
import type { Category, PaginationMeta } from '@/types/category';

const router = useRouter();

const categories = ref<Category[]>([]);
const meta = ref<PaginationMeta>({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
    from: null,
    to: null,
});
const loading = ref(true);
const fetchError = ref(false);

const deleteTarget = ref<Category | null>(null);
const showDeleteDialog = ref(false);
const deleting = ref(false);

const visiblePages = computed(() => {
    const current = meta.value.current_page;
    const last = meta.value.last_page;
    const pages: (number | 'ellipsis')[] = [];

    if (last <= 7) {
        for (let i = 1; i <= last; i++) pages.push(i);
        return pages;
    }

    pages.push(1);

    if (current > 3) pages.push('ellipsis');

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < last - 2) pages.push('ellipsis');

    pages.push(last);
    return pages;
});

async function fetchCategories(page = 1) {
    loading.value = true;
    fetchError.value = false;
    try {
        const response = await categoryService.list(page);
        const paginated = response.data;

        categories.value = paginated.data;
        meta.value = {
            current_page: paginated.current_page,
            per_page: paginated.per_page,
            total: paginated.total,
            last_page: paginated.last_page,
            from: paginated.from,
            to: paginated.to,
        };
    } catch (err) {
        console.error('Failed to load categories:', err);
        fetchError.value = true;
    } finally {
        loading.value = false;
    }
}

function goToPage(page: number) {
    if (page < 1 || page > meta.value.last_page) return;
    fetchCategories(page);
}

function confirmDelete(category: Category) {
    deleteTarget.value = category;
    showDeleteDialog.value = true;
}

async function handleDelete() {
    if (!deleteTarget.value) return;
    deleting.value = true;
    try {
        await categoryService.destroy(deleteTarget.value.id);
        showDeleteDialog.value = false;
        deleteTarget.value = null;
        await fetchCategories(meta.value.current_page);
    } catch (err: any) {
        console.error('Failed to delete category:', err);
    } finally {
        deleting.value = false;
    }
}

function getImageUrl(image: string | null) {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    const base = import.meta.env.VITE_API_BASE_URL;
    return `${base}/storage/${image}`;
}

onMounted(() => fetchCategories());
</script>

<template>
    <div class="space-y-6 p-6">
        <!-- Page Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">
                    Categories
                </h1>
                <p class="text-sm text-muted-foreground">
                    Manage your product categories
                </p>
            </div>
            <Button @click="router.push('/categories/create')">
                <Plus class="mr-2 h-4 w-4" />
                Add Category
            </Button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <Spinner class="h-8 w-8" />
        </div>

        <!-- Error State -->
        <div
            v-else-if="fetchError"
            class="flex flex-col items-center justify-center rounded-lg border border-dashed py-20"
        >
            <p class="text-sm text-muted-foreground">
                Failed to load categories. Make sure the API server is running.
            </p>
            <Button variant="outline" class="mt-4" @click="fetchCategories()">
                Try Again
            </Button>
        </div>

        <!-- Empty State -->
        <div
            v-else-if="categories.length === 0"
            class="flex flex-col items-center justify-center rounded-lg border border-dashed py-20"
        >
            <p class="text-muted-foreground">No categories found.</p>
            <Button
                variant="outline"
                class="mt-4"
                @click="router.push('/categories/create')"
            >
                <Plus class="mr-2 h-4 w-4" />
                Create your first category
            </Button>
        </div>

        <!-- Data Table -->
        <div v-else class="rounded-lg border">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/50">
                            <th class="px-4 py-3 text-left font-medium">
                                Image
                            </th>
                            <th class="px-4 py-3 text-left font-medium">
                                Name
                            </th>
                            <th class="px-4 py-3 text-left font-medium">
                                Slug
                            </th>
                            <th class="px-4 py-3 text-center font-medium">
                                Position
                            </th>
                            <th class="px-4 py-3 text-center font-medium">
                                Status
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="category in categories"
                            :key="category.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/30"
                        >
                            <td class="px-4 py-3">
                                <img
                                    v-if="category.image"
                                    :src="getImageUrl(category.image)"
                                    :alt="category.name"
                                    class="h-10 w-10 rounded-md border object-cover"
                                />
                                <div
                                    v-else
                                    class="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground"
                                >
                                    N/A
                                </div>
                            </td>
                            <td class="px-4 py-3 font-medium">
                                {{ category.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ category.slug }}
                            </td>
                            <td class="px-4 py-3 text-center">
                                {{ category.sort_order }}
                            </td>
                            <td class="px-4 py-3 text-center">
                                <Badge
                                    :variant="
                                        category.is_active
                                            ? 'default'
                                            : 'secondary'
                                    "
                                >
                                    {{
                                        category.is_active
                                            ? 'Active'
                                            : 'Inactive'
                                    }}
                                </Badge>
                            </td>
                            <td class="px-4 py-3">
                                <div
                                    class="flex items-center justify-end gap-1"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        @click="
                                            router.push(
                                                `/categories/${category.id}/edit`,
                                            )
                                        "
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="text-destructive hover:bg-destructive hover:text-white"
                                        @click="confirmDelete(category)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div
                v-if="meta.last_page > 1"
                class="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row"
            >
                <p class="text-sm text-muted-foreground">
                    Showing {{ meta.from }} to {{ meta.to }} of
                    {{ meta.total }} results
                </p>
                <div class="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="meta.current_page <= 1"
                        @click="goToPage(meta.current_page - 1)"
                    >
                        <ChevronLeft class="mr-1 h-4 w-4" />
                        Previous
                    </Button>
                    <template
                        v-for="(page, idx) in visiblePages"
                        :key="idx"
                    >
                        <span
                            v-if="page === 'ellipsis'"
                            class="px-1 text-muted-foreground"
                        >
                            &hellip;
                        </span>
                        <Button
                            v-else
                            :variant="
                                page === meta.current_page
                                    ? 'default'
                                    : 'outline'
                            "
                            size="sm"
                            class="min-w-9"
                            @click="goToPage(page)"
                        >
                            {{ page }}
                        </Button>
                    </template>
                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="meta.current_page >= meta.last_page"
                        @click="goToPage(meta.current_page + 1)"
                    >
                        Next
                        <ChevronRight class="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog
            v-if="showDeleteDialog"
            :open="showDeleteDialog"
            @update:open="showDeleteDialog = $event"
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete
                        <strong>{{ deleteTarget?.name }}</strong
                        >? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose as-child>
                        <Button variant="outline" :disabled="deleting"
                            >Cancel</Button
                        >
                    </DialogClose>
                    <Button
                        variant="destructive"
                        :disabled="deleting"
                        @click="handleDelete"
                    >
                        <Spinner v-if="deleting" />
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
