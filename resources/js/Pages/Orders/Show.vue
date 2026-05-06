<template>
    <AppLayout>
        <div class="mb-6">
            <Link href="/orders" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
            </Link>
            <h1 class="text-2xl font-bold text-slate-800">Order Details</h1>
            <p class="text-slate-500 text-sm mt-1">Review order items and update status</p>
        </div>

        <div v-if="order" class="flex flex-wrap items-center gap-2 mb-6">
            <button
                type="button"
                @click="printInvoice"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" />
                </svg>
                Print Invoice
            </button>
            <button
                type="button"
                @click="downloadInvoicePdf"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-8m0 8l-3-3m3 3l3-3M5 20h14" />
                </svg>
                Download PDF
            </button>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20">
            <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>

        <div
            v-else-if="!order"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
        >
            <h3 class="text-lg font-semibold text-slate-800 mb-1">Order not found</h3>
            <p class="text-slate-500 text-sm mb-4">This order might be deleted or unavailable.</p>
            <Link href="/orders" class="inline-flex px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors">
                Go to Orders
            </Link>
        </div>

        <div v-else class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 class="text-lg font-semibold text-slate-800">{{ order.order_number ?? `#${order.id}` }}</h2>
                            <p class="text-sm text-slate-500 mt-0.5">Placed {{ formatDate(order.created_at) }}</p>
                        </div>
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                            :class="statusClass(order.status)"
                        >
                            {{ statusLabel(order.status) }}
                        </span>
                    </div>

                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-wide text-slate-400 mb-1">Customer</p>
                            <p class="text-sm font-medium text-slate-700">{{ order.customer_name ?? order.user?.name ?? 'N/A' }}</p>
                            <p class="text-sm text-slate-500">{{ order.customer_email ?? order.user?.email ?? 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-xs uppercase tracking-wide text-slate-400 mb-1">Phone</p>
                            <p class="text-sm text-slate-700">{{ order.customer_phone ?? order.shipping_phone ?? 'N/A' }}</p>
                        </div>
                    </div>

                    <div class="mt-6 overflow-x-auto border border-slate-100 rounded-xl">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="bg-slate-50 text-left">
                                    <th class="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                                    <th class="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                                    <th class="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                                    <th class="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="item in orderItems" :key="item.id ?? `${item.product_id}-${item.product_name}`">
                                    <td class="px-4 py-3">
                                        <p class="font-medium text-slate-700">{{ item.product_name ?? item.product?.name ?? 'Item' }}</p>
                                        <p class="text-xs text-slate-400">{{ item.product_code ?? item.product?.code ?? '' }}</p>
                                    </td>
                                    <td class="px-4 py-3 text-slate-600">{{ item.quantity ?? 0 }}</td>
                                    <td class="px-4 py-3 text-slate-600">{{ money(item.unit_price ?? item.price ?? 0) }}</td>
                                    <td class="px-4 py-3 text-right font-medium text-slate-700">
                                        {{ money(item.item_total ?? item.total ?? (Number(item.quantity ?? 0) * Number(item.unit_price ?? item.price ?? 0))) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 class="text-sm font-semibold text-slate-800 mb-4">Totals</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center justify-between text-slate-600">
                                <span>Item Total</span>
                                <span>{{ money(orderTotals.subtotal ?? order.subtotal ?? 0) }}</span>
                            </div>
                            <div class="flex items-center justify-between text-slate-600">
                                <span>Shipping</span>
                                <span>{{ money(orderTotals.shipping_fee ?? order.shipping_fee ?? 0) }}</span>
                            </div>
                            <div class="flex items-center justify-between text-slate-600">
                                <span>Discount</span>
                                <span>-{{ money(orderTotals.discount_amount ?? order.discount_amount ?? 0) }}</span>
                            </div>
                            <div class="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between font-semibold text-slate-800">
                                <span>Grand Total</span>
                                <span>{{ money(orderTotals.grand_total ?? order.total ?? 0) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 class="text-sm font-semibold text-slate-800 mb-4">Update Status</h3>

                        <div v-if="errors.general" class="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {{ errors.general }}
                        </div>

                        <form class="space-y-3" @submit.prevent="handleStatusUpdate">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    v-model="statusForm.status"
                                    class="w-full px-4 py-2.5 border rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    :class="errors.status ? 'border-red-400' : 'border-slate-200'"
                                >
                                    <option v-for="status in statusOptions" :key="status" :value="status">{{ statusLabel(status) }}</option>
                                </select>
                                <p v-if="errors.status" class="mt-1 text-xs text-red-500">{{ errors.status[0] }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Public Note</label>
                                <textarea
                                    v-model="statusForm.note"
                                    rows="2"
                                    placeholder="Message for timeline/log..."
                                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Admin Note</label>
                                <textarea
                                    v-model="statusForm.admin_notes"
                                    rows="2"
                                    placeholder="Internal admin note..."
                                    class="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                :disabled="processing"
                                class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-xl transition-colors"
                            >
                                {{ processing ? 'Updating...' : 'Update Status' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 class="text-sm font-semibold text-slate-800 mb-4">Status Timeline</h3>
                <div v-if="statusLogs.length === 0" class="text-sm text-slate-500">No status logs available.</div>
                <div v-else class="space-y-4">
                    <div
                        v-for="(log, idx) in statusLogs"
                        :key="log.id ?? idx"
                        class="relative pl-6"
                    >
                        <span class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <div class="text-sm">
                            <p class="font-medium text-slate-800">
                                {{ statusLabel(log.to_status ?? log.status ?? order.status) }}
                                <span v-if="log.from_status" class="text-slate-500 font-normal">
                                    from {{ statusLabel(log.from_status) }}
                                </span>
                            </p>
                            <p class="text-xs text-slate-500 mt-0.5">{{ formatDate(log.created_at) }}</p>
                            <p v-if="log.note" class="text-sm text-slate-600 mt-1">{{ log.note }}</p>
                            <p v-if="log.admin_notes" class="text-xs text-slate-500 mt-1">Admin: {{ log.admin_notes }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AppLayout from '@/Layouts/AppLayout.vue';
import { useOrder } from '@/Composables/useOrder';

const page = usePage();
const orderId = page.props.orderId;

const { order, errors, processing, fetchOrder, updateOrderStatus } = useOrder();

const loading = ref(true);
const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusForm = ref({
    status: 'pending',
    note: '',
    admin_notes: '',
});

const orderItems = computed(() => order.value?.items ?? []);
const statusLogs = computed(() => order.value?.status_logs ?? order.value?.logs ?? []);
const orderTotals = computed(() => order.value?.totals ?? {});

onMounted(async () => {
    await fetchOrder(orderId);
    if (order.value?.status) {
        statusForm.value.status = order.value.status;
    }
    loading.value = false;
});

async function handleStatusUpdate() {
    const payload = {
        status: statusForm.value.status,
        note: statusForm.value.note || undefined,
        admin_notes: statusForm.value.admin_notes || undefined,
    };
    const success = await updateOrderStatus(orderId, payload);
    if (success) {
        await fetchOrder(orderId);
    }
}

function formatDate(value) {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString();
}

function money(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function escapeHtml(text) {
    return String(text ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function invoiceFileName() {
    const ref = order.value?.order_number ?? `order-${order.value?.id ?? 'invoice'}`;
    return `invoice-${ref}.pdf`;
}

function printInvoice() {
    if (!order.value) return;

    const invoiceRows = orderItems.value
        .map((item) => {
            const name = item.product_name ?? item.product?.name ?? 'Item';
            const code = item.product_code ?? item.product?.code ?? '';
            const qty = Number(item.quantity ?? 0);
            const unit = Number(item.unit_price ?? item.price ?? 0);
            const subtotal = Number(item.item_total ?? item.total ?? (qty * unit));

            return `
                <tr>
                    <td>${escapeHtml(name)}<br/><small style="color:#64748b">${escapeHtml(code)}</small></td>
                    <td style="text-align:center">${qty}</td>
                    <td style="text-align:right">${money(unit)}</td>
                    <td style="text-align:right">${money(subtotal)}</td>
                </tr>
            `;
        })
        .join('');

    const html = `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>${escapeHtml(order.value.order_number ?? `Order #${order.value.id}`)} Invoice</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #0f172a; margin: 24px; }
                    .head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px; }
                    h1 { margin:0; font-size: 24px; }
                    .muted { color:#64748b; }
                    table { width:100%; border-collapse: collapse; margin-top: 14px; }
                    th, td { border: 1px solid #e2e8f0; padding: 10px; font-size: 13px; vertical-align: top; }
                    th { background: #f8fafc; text-align: left; }
                    .totals { margin-top: 18px; margin-left:auto; width: 320px; }
                    .totals .row { display:flex; justify-content:space-between; padding: 4px 0; }
                    .totals .grand { font-weight:700; border-top:1px solid #e2e8f0; padding-top:8px; margin-top:6px; }
                    @media print { body { margin: 10mm; } }
                </style>
            </head>
            <body>
                <div class="head">
                    <div>
                        <h1>Invoice</h1>
                        <div class="muted">ShopEase Admin</div>
                    </div>
                    <div style="text-align:right">
                        <div><strong>${escapeHtml(order.value.order_number ?? `#${order.value.id}`)}</strong></div>
                        <div class="muted">${escapeHtml(formatDate(order.value.created_at))}</div>
                    </div>
                </div>
                <div style="margin-bottom: 16px">
                    <div><strong>Bill To:</strong> ${escapeHtml(order.value.customer_name ?? order.value.user?.name ?? 'N/A')}</div>
                    <div class="muted">${escapeHtml(order.value.customer_email ?? order.value.user?.email ?? 'N/A')}</div>
                    <div class="muted">${escapeHtml(order.value.customer_phone ?? '')}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style="width:70px;text-align:center">Qty</th>
                            <th style="width:120px;text-align:right">Price</th>
                            <th style="width:120px;text-align:right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>${invoiceRows}</tbody>
                </table>
                <div class="totals">
                    <div class="row"><span>Subtotal</span><span>${money(orderTotals.value.subtotal ?? order.value.subtotal ?? 0)}</span></div>
                    <div class="row"><span>Shipping</span><span>${money(orderTotals.value.shipping_fee ?? order.value.shipping_fee ?? 0)}</span></div>
                    <div class="row"><span>Discount</span><span>-${money(orderTotals.value.discount_amount ?? order.value.discount_amount ?? 0)}</span></div>
                    <div class="row grand"><span>Grand Total</span><span>${money(orderTotals.value.grand_total ?? order.value.total ?? 0)}</span></div>
                </div>
            </body>
        </html>
    `;

    const popup = window.open('', '_blank', 'width=1024,height=768');
    if (!popup) return;
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    popup.print();
}

function downloadInvoicePdf() {
    if (!order.value) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.text('INVOICE', 14, 20);
    doc.setFontSize(10);
    doc.text('ShopEase Admin', 14, 27);
    doc.text(String(order.value.order_number ?? `Order #${order.value.id}`), pageWidth - 14, 20, { align: 'right' });
    doc.text(formatDate(order.value.created_at), pageWidth - 14, 27, { align: 'right' });

    doc.setFontSize(11);
    doc.text('Bill To', 14, 38);
    doc.setFontSize(10);
    doc.text(String(order.value.customer_name ?? order.value.user?.name ?? 'N/A'), 14, 44);
    doc.text(String(order.value.customer_email ?? order.value.user?.email ?? 'N/A'), 14, 50);
    doc.text(String(order.value.customer_phone ?? ''), 14, 56);

    const rows = orderItems.value.map((item) => {
        const qty = Number(item.quantity ?? 0);
        const unit = Number(item.unit_price ?? item.price ?? 0);
        const subtotal = Number(item.item_total ?? item.total ?? (qty * unit));
        return [
            item.product_name ?? item.product?.name ?? 'Item',
            String(qty),
            money(unit),
            money(subtotal),
        ];
    });

    autoTable(doc, {
        startY: 64,
        head: [['Item', 'Qty', 'Price', 'Subtotal']],
        body: rows,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [37, 99, 235] },
        columnStyles: {
            1: { halign: 'center', cellWidth: 24 },
            2: { halign: 'right', cellWidth: 34 },
            3: { halign: 'right', cellWidth: 34 },
        },
    });

    const y = doc.lastAutoTable.finalY + 10;
    const rightX = pageWidth - 14;
    doc.setFontSize(10);
    doc.text(`Subtotal: ${money(orderTotals.value.subtotal ?? order.value.subtotal ?? 0)}`, rightX, y, { align: 'right' });
    doc.text(`Shipping: ${money(orderTotals.value.shipping_fee ?? order.value.shipping_fee ?? 0)}`, rightX, y + 6, { align: 'right' });
    doc.text(`Discount: -${money(orderTotals.value.discount_amount ?? order.value.discount_amount ?? 0)}`, rightX, y + 12, { align: 'right' });
    doc.setFontSize(12);
    doc.text(`Grand Total: ${money(orderTotals.value.grand_total ?? order.value.total ?? 0)}`, rightX, y + 20, { align: 'right' });

    doc.save(invoiceFileName());
}

function statusLabel(status) {
    if (!status) return 'Unknown';
    return status.replace('_', ' ');
}

function statusClass(status) {
    const map = {
        pending: 'bg-amber-100 text-amber-700',
        confirmed: 'bg-blue-100 text-blue-700',
        processing: 'bg-indigo-100 text-indigo-700',
        shipped: 'bg-cyan-100 text-cyan-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] ?? 'bg-slate-100 text-slate-700';
}
</script>
