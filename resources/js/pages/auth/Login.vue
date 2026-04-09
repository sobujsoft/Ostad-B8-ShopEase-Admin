<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
    email: '',
    password: '',
    remember: false,
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

async function handleSubmit() {
    errors.value = {};
    processing.value = true;

    try {
        await authStore.login({
            email: form.value.email,
            password: form.value.password,
        });
        router.push({ name: 'dashboard' });
    } catch (error: any) {
        if (error.response?.status === 422) {
            const serverErrors = error.response.data.errors ?? {};
            for (const [key, messages] of Object.entries(serverErrors)) {
                errors.value[key] = (messages as string[])[0];
            }
        } else {
            errors.value.email =
                error.response?.data?.message ?? 'Login failed. Please try again.';
        }
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <div class="grid gap-6">
            <div class="grid gap-2">
                <Label for="email">Email address</Label>
                <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="email"
                    placeholder="email@example.com"
                />
                <InputError :message="errors.email" />
            </div>

            <div class="grid gap-2">
                <div class="flex items-center justify-between">
                    <Label for="password">Password</Label>
                </div>
                <PasswordInput
                    id="password"
                    v-model="form.password"
                    required
                    :tabindex="2"
                    autocomplete="current-password"
                    placeholder="Password"
                />
                <InputError :message="errors.password" />
            </div>

            <div class="flex items-center justify-between">
                <Label for="remember" class="flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        :checked="form.remember"
                        @update:checked="form.remember = $event"
                        :tabindex="3"
                    />
                    <span>Remember me</span>
                </Label>
            </div>

            <Button
                type="submit"
                class="mt-4 w-full"
                :tabindex="4"
                :disabled="processing"
            >
                <Spinner v-if="processing" />
                Log in
            </Button>
        </div>

        <div class="text-center text-sm text-muted-foreground">
            Don't have an account?
            <TextLink href="/register" :tabindex="5">Sign up</TextLink>
        </div>
    </form>
</template>
