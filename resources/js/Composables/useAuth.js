import { ref } from 'vue';
import axios from 'axios';
import { router } from '@inertiajs/vue3';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
const token = ref(localStorage.getItem('auth_token') || null);

function setSession(userData, authToken) {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('auth_token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}

function clearSession() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
}

// Restore axios auth header on page load
if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
}

export function useAuth() {
    const errors = ref({});
    const processing = ref(false);

    async function register(form) {
        errors.value = {};
        processing.value = true;
        try {
            const { data } = await axios.post(`${API_BASE}/register`, form);
            setSession(data.data.user, data.data.token);
            router.visit('/dashboard');
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Registration failed.' };
            }
        } finally {
            processing.value = false;
        }
    }

    async function login(form) {
        errors.value = {};
        processing.value = true;
        try {
            const { data } = await axios.post(`${API_BASE}/login`, form);
            setSession(data.data.user, data.data.token);
            router.visit('/dashboard');
        } catch (err) {
            if (err.response?.status === 422) {
                errors.value = err.response.data.errors ?? {};
            } else {
                errors.value = { general: err.response?.data?.message ?? 'Invalid credentials.' };
            }
        } finally {
            processing.value = false;
        }
    }

    async function logout() {
        processing.value = true;
        try {
            await axios.post(`${API_BASE}/logout`);
        } catch (_) {
            // logout regardless of API response
        } finally {
            clearSession();
            processing.value = false;
            router.visit('/login');
        }
    }

    async function fetchUser() {
        try {
            const { data } = await axios.get(`${API_BASE}/user`);
            user.value = data.data ?? data;
            localStorage.setItem('user', JSON.stringify(user.value));
        } catch (_) {
            clearSession();
            router.visit('/login');
        }
    }

    return {
        user,
        token,
        errors,
        processing,
        register,
        login,
        logout,
        fetchUser,
        isAuthenticated: () => !!token.value,
    };
}
