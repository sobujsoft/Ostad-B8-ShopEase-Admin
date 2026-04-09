<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItem } from '@/types';

const route = useRoute();
const breadcrumbs = computed<BreadcrumbItem[]>(
    () => (route.meta.breadcrumbs as BreadcrumbItem[]) ?? [],
);
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <RouterView />
    </AppLayout>
</template>
