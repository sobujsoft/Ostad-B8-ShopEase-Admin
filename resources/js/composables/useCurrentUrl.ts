import { useRoute } from 'vue-router';
import type { ComputedRef, DeepReadonly } from 'vue';
import { computed, readonly } from 'vue';

export type UseCurrentUrlReturn = {
    currentUrl: DeepReadonly<ComputedRef<string>>;
    isCurrentUrl: (
        urlToCheck: string,
        currentUrl?: string,
        startsWith?: boolean,
    ) => boolean;
    isCurrentOrParentUrl: (
        urlToCheck: string,
        currentUrl?: string,
    ) => boolean;
    whenCurrentUrl: <T, F = null>(
        urlToCheck: string,
        ifTrue: T,
        ifFalse?: F,
    ) => T | F;
};

export function useCurrentUrl(): UseCurrentUrlReturn {
    const route = useRoute();
    const currentUrlReactive = computed(() => route.path);

    function isCurrentUrl(
        urlToCheck: string,
        currentUrl?: string,
        startsWith: boolean = false,
    ) {
        const urlToCompare = currentUrl ?? currentUrlReactive.value;

        const comparePath = (path: string): boolean =>
            startsWith ? urlToCompare.startsWith(path) : path === urlToCompare;

        if (!urlToCheck.startsWith('http')) {
            return comparePath(urlToCheck);
        }

        try {
            const absoluteUrl = new URL(urlToCheck);
            return comparePath(absoluteUrl.pathname);
        } catch {
            return false;
        }
    }

    function isCurrentOrParentUrl(urlToCheck: string, currentUrl?: string) {
        return isCurrentUrl(urlToCheck, currentUrl, true);
    }

    function whenCurrentUrl(
        urlToCheck: string,
        ifTrue: any,
        ifFalse: any = null,
    ) {
        return isCurrentUrl(urlToCheck) ? ifTrue : ifFalse;
    }

    return {
        currentUrl: readonly(currentUrlReactive),
        isCurrentUrl,
        isCurrentOrParentUrl,
        whenCurrentUrl,
    };
}
