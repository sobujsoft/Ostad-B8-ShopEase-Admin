import api from '@/services/api';
import type { Category, PaginatedData } from '@/types/category';

interface CategoriesResponse {
    success: boolean;
    message: string;
    data: PaginatedData<Category>;
}

interface CategoryResponse {
    success: boolean;
    message: string;
    data: Category;
}

export const categoryService = {
    async list(page = 1): Promise<CategoriesResponse> {
        const { data } = await api.get('/api/v1/categories', {
            params: { page },
        });
        return data;
    },

    async show(id: number): Promise<CategoryResponse> {
        const { data } = await api.get(`/api/v1/categories/${id}`);
        return data;
    },

    async create(formData: FormData): Promise<CategoryResponse> {
        const { data } = await api.post('/api/v1/categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    async update(id: number, formData: FormData): Promise<CategoryResponse> {
        const { data } = await api.post(
            `/api/v1/categories/${id}`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            },
        );
        return data;
    },

    async destroy(id: number): Promise<{ success: boolean; message: string }> {
        const { data } = await api.delete(`/api/v1/categories/${id}`);
        return data;
    },
};
