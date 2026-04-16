<template>
    <GuestLayout>
        <div>
            <h2 class="text-xl font-bold text-white mb-1">Create account</h2>
            <p class="text-slate-400 text-sm mb-6">Register a new admin account</p>

            <!-- General error -->
            <div v-if="errors.general" class="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {{ errors.general }}
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
                <!-- Name -->
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
                    <input
                        v-model="form.name"
                        type="text"
                        autocomplete="name"
                        placeholder="Admin User"
                        class="w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white/8"
                        :class="errors.name ? 'border-red-500/60' : 'border-white/10'"
                    />
                    <p v-if="errors.name" class="mt-1 text-xs text-red-400">{{ errors.name[0] }}</p>
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                    <input
                        v-model="form.email"
                        type="email"
                        autocomplete="email"
                        placeholder="admin@example.com"
                        class="w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white/8"
                        :class="errors.email ? 'border-red-500/60' : 'border-white/10'"
                    />
                    <p v-if="errors.email" class="mt-1 text-xs text-red-400">{{ errors.email[0] }}</p>
                </div>

                <!-- Phone -->
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1.5">Phone number</label>
                    <input
                        v-model="form.phone"
                        type="tel"
                        autocomplete="tel"
                        placeholder="01700000000"
                        class="w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white/8"
                        :class="errors.phone ? 'border-red-500/60' : 'border-white/10'"
                    />
                    <p v-if="errors.phone" class="mt-1 text-xs text-red-400">{{ errors.phone[0] }}</p>
                </div>

                <!-- Password -->
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                    <div class="relative">
                        <input
                            v-model="form.password"
                            :type="showPassword ? 'text' : 'password'"
                            autocomplete="new-password"
                            placeholder="Min. 8 characters"
                            class="w-full px-4 py-2.5 pr-11 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white/8"
                            :class="errors.password ? 'border-red-500/60' : 'border-white/10'"
                        />
                        <button
                            type="button"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            @click="showPassword = !showPassword"
                        >
                            <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                            </svg>
                        </button>
                    </div>
                    <p v-if="errors.password" class="mt-1 text-xs text-red-400">{{ errors.password[0] }}</p>
                </div>

                <!-- Confirm Password -->
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1.5">Confirm password</label>
                    <input
                        v-model="form.password_confirmation"
                        :type="showPassword ? 'text' : 'password'"
                        autocomplete="new-password"
                        placeholder="Re-enter password"
                        class="w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white/8"
                        :class="errors.password_confirmation ? 'border-red-500/60' : 'border-white/10'"
                    />
                    <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-400">{{ errors.password_confirmation[0] }}</p>
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    :disabled="processing"
                    class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-2"
                >
                    <svg v-if="processing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {{ processing ? 'Creating account…' : 'Create Account' }}
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-slate-400">
                Already have an account?
                <Link href="/login" class="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    </GuestLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { useAuth } from '@/Composables/useAuth';

const { register, errors, processing } = useAuth();
const showPassword = ref(false);

const form = ref({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
});

async function handleRegister() {
    await register(form.value);
}
</script>
