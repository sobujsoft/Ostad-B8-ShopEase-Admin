import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import api from '@/services/api';
import type { User } from '@/types';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
}

interface ApiValidationError {
    response?: {
        status: number;
        data: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem('auth_token'));
    const loading = ref(false);

    const isAuthenticated = computed(() => !!token.value);

    function setAuth(userData: User, authToken: string) {
        user.value = userData;
        token.value = authToken;
        localStorage.setItem('auth_token', authToken);
    }

    function clearAuth() {
        user.value = null;
        token.value = null;
        localStorage.removeItem('auth_token');
    }

    async function login(payload: LoginPayload) {
        loading.value = true;
        try {
            const { data } = await api.post('/api/login', payload);
            setAuth(data.data.user, data.data.token);
            return data;
        } catch (error) {
            clearAuth();
            throw error as ApiValidationError;
        } finally {
            loading.value = false;
        }
    }

    async function register(payload: RegisterPayload) {
        loading.value = true;
        try {
            const { data } = await api.post('/api/register', payload);
            setAuth(data.data.user, data.data.token);
            return data;
        } catch (error) {
            clearAuth();
            throw error as ApiValidationError;
        } finally {
            loading.value = false;
        }
    }

    async function fetchUser() {
        if (!token.value) return null;
        loading.value = true;
        try {
            const { data } = await api.get('/api/user');
            user.value = data.data ?? data;
            return user.value;
        } catch {
            clearAuth();
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        try {
            await api.post('/api/logout');
        } finally {
            clearAuth();
        }
    }

    return {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        fetchUser,
        logout,
    };
});
