// lib/shipping-zones.ts
//
// Single source of truth for delivery zones and fees — used by both
// CheckoutForm.tsx (to render the picker) and the verify route (to
// independently recompute the expected charge server-side, rather than
// trusting whatever fee the client claims in the request body).

export interface ShippingZone {
  id: string;
  name: string;
  fee: number;
  locations: string[];
}

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: "kasoa-pickup",
    name: "Kasoa Pickup (Free)",
    fee: 0,
    locations: ["Blue Top", "Lawyer", "Transformer", "American Junction", "Kakraba Junction", "Tuba First Light", "Kasoa 2nd", "Kasoa Zongo(Near Sabilul al-Falah School)", "Kasoa Newtown", "Walantu Junction"],
  },
  {
    id: "kasoa-communities",
    name: "Kasoa Communities (GH₵6)",
    fee: 6,
    locations: ["Peacetown", "Tuba Roundabout(1st & 2nd)", "Amanfro", "Nyanyano", "Galilea", "Adade"],
  },
  {
    id: "winneba-axis",
    name: "Winneba Road Axis (GH₵12)",
    fee: 12,
    locations: ["Dominasi", "Akoti", "Breku", "Fetteh Kakraba", "Liberia Camp"],
  },
  {
    id: "accra-highway",
    name: "Accra Highway Axis (GH₵18)",
    fee: 18,
    locations: ["West Hills", "Weija", "Tetegu", "Mallam", "Dansoman", "Circle", "Tudu", "Barrier", "Kaneshie"],
  },
  {
    id: "greater-accra-extended",
    name: "Madina / Lapaz / Nsawam / Amasaman (GH₵30)",
    fee: 30,
    locations: ["Madina", "Lapaz", "Nsawam", "Amasaman"],
  },
];

export function getZoneById(zoneId: string | null | undefined): ShippingZone | null {
  if (!zoneId) return null;
  return SHIPPING_ZONES.find((z) => z.id === zoneId) || null;
}