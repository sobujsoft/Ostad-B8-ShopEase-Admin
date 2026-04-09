<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebarLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItem } from '@/types';

const route = useRoute();
const breadcrumbs = computed<BreadcrumbItem[]>(
    () => (route.meta.breadcrumbs as BreadcrumbItem[]) ?? [],
);
</script>

<template>
    <AppSidebarLayout :breadcrumbs="breadcrumbs">
        <RouterView />
    </AppSidebarLayout>
</template>
