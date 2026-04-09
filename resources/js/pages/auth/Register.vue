<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

async function handleSubmit() {
    errors.value = {};
    processing.value = true;

    try {
        await authStore.register({
            name: form.value.name,
            email: form.value.email,
            phone: form.value.phone,
            password: form.value.password,
            password_confirmation: form.value.password_confirmation,
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
                error.response?.data?.message ?? 'Registration failed. Please try again.';
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
                <Label for="name">Name</Label>
                <Input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="name"
                    placeholder="Full name"
                />
                <InputError :message="errors.name" />
            </div>

            <div class="grid gap-2">
                <Label for="email">Email address</Label>
                <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    :tabindex="2"
                    autocomplete="email"
                    placeholder="email@example.com"
                />
                <InputError :message="errors.email" />
            </div>

            <div class="grid gap-2">
                <Label for="phone">Phone</Label>
                <Input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    required
                    :tabindex="3"
                    autocomplete="tel"
                    placeholder="01700000000"
                />
                <InputError :message="errors.phone" />
            </div>

            <div class="grid gap-2">
                <Label for="password">Password</Label>
                <PasswordInput
                    id="password"
                    v-model="form.password"
                    required
                    :tabindex="4"
                    autocomplete="new-password"
                    placeholder="Password"
                />
                <InputError :message="errors.password" />
            </div>

            <div class="grid gap-2">
                <Label for="password_confirmation">Confirm password</Label>
                <PasswordInput
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    required
                    :tabindex="5"
                    autocomplete="new-password"
                    placeholder="Confirm password"
                />
                <InputError :message="errors.password_confirmation" />
            </div>

            <Button
                type="submit"
                class="mt-2 w-full"
                :tabindex="6"
                :disabled="processing"
            >
                <Spinner v-if="processing" />
                Create account
            </Button>
        </div>

        <div class="text-center text-sm text-muted-foreground">
            Already have an account?
            <TextLink href="/login" :tabindex="7">Log in</TextLink>
        </div>
    </form>
</template>
