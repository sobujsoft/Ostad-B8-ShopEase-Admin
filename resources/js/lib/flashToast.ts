import { toast } from 'vue-sonner';
import type { FlashToast } from '@/types/ui';

export function showToast(data: FlashToast): void {
    toast[data.type](data.message);
}
