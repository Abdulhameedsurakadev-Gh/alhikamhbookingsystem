// lib/order-number.ts

export function formatOrderNumber(orderId: string): string {
  const normalized = orderId.replace(/-/g, "").toUpperCase();

  return `${normalized.slice(0, 8)}-${normalized.slice(8, 12)}`;
}