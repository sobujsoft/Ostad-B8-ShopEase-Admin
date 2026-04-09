<script setup lang="ts">
type Props = {
    href: string;
    tabindex?: number;
};

defineProps<Props>();

function isExternal(url: string) {
    return url.startsWith('http://') || url.startsWith('https://');
}
</script>

<template>
    <a
        v-if="isExternal(href)"
        :href="href"
        :tabindex="tabindex"
        target="_blank"
        rel="noopener noreferrer"
        class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
    >
        <slot />
    </a>
    <RouterLink
        v-else
        :to="href"
        :tabindex="tabindex"
        class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
    >
        <slot />
    </RouterLink>
</template>
