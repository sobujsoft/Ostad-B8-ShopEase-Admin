export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    products_count?: number;
    created_at: string;
    updated_at: string;
}

export interface CategoryFormData {
    name: string;
    description: string;
    image: File | null;
    is_active: string;
    sort_order: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}
