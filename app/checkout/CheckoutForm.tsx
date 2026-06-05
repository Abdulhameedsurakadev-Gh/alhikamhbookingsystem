"use client";

import { useState, useMemo } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

interface ShippingZone {
  id: string;
  name: string;
  fee: number;
  locations: string[];
}

const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: "kasoa-pickup",
    name: "Kasoa Pickup (Free)",
    fee: 0,
    locations: ["Blue Top", "Lawyer", "Transformer", "American Junction", "Kakraba Junction", "Tuba First Light"],
  },
  {
    id: "kasoa-communities",
    name: "Kasoa Communities (GH₵10)",
    fee: 10,
    locations: ["Newtown", "Kasoa 2nd", "Amanfro", "Tuba Roundabout", "Galilea", "Zongo", "Walatu", "Kakraba Down"],
  },
  {
    id: "winneba-axis",
    name: "Winneba Road Axis (GH₵20)",
    fee: 20,
    locations: ["Dominasi", "Akoti", "Breku", "Fetteh Kakraba", "Liberia Camp"],
  },
  {
    id: "accra-highway",
    name: "Accra Highway Axis (GH₵20)",
    fee: 20,
    locations: ["West Hills", "Weija", "Tetegu", "Mallam", "Dansoman", "Circle", "Tudu", "Barrier"],
  },
  {
    id: "greater-accra-extended",
    name: "Madina / Lapaz / Nsawam / Amasaman (GH₵35)",
    fee: 35,
    locations: ["Madina", "Lapaz", "Nsawam", "Amasaman"],
  },
  {
    id: "tema",
    name: "Tema (GH₵45)",
    fee: 45,
    locations: ["Tema Community 1-25"],
  },
];

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  userId: string;
  userEmail: string;
  cartItems: CartItem[];
}

export function CheckoutForm({ userId, userEmail, cartItems }: CheckoutFormProps): React.JSX.Element {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    zoneId: "",
    specificLocation: "",
    landmark: "",
  });

  const bookTotalAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const shippingFee = selectedZone ? selectedZone.fee : 0;
  const grandTotalPayable = bookTotalAmount + shippingFee;

  const handleZoneChange = (zoneId: string) => {
    const zone = SHIPPING_ZONES.find(z => z.id === zoneId) || null;
    setSelectedZone(zone);
    setFormData({ ...formData, zoneId: zoneId, specificLocation: "" });
  };

  const handlePaystackPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.fullName || !formData.phone || !formData.zoneId || !formData.specificLocation || !formData.landmark) {
      setError("Please fill in all your specific delivery steps and recipient information.");
      return;
    }

    setIsProcessing(true);

    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Paystack Public Key is missing from your environment variables.");
      }

      const compiledAddressString = `Zone: ${selectedZone?.name} | Area: ${formData.specificLocation} | Landmark Details: ${formData.landmark}`;

      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();
      
      paystack.newTransaction({
        key: publicKey,
        email: userEmail,
        amount: Math.round(grandTotalPayable * 100), 
        currency: "GHS",
        metadata: {
          custom_fields: [
            { display_name: "User ID", variable_name: "user_id", value: userId },
            { display_name: "Full Name", variable_name: "full_name", value: formData.fullName },
            { display_name: "Phone", variable_name: "phone", value: formData.phone },
            { display_name: "Compiled Address", variable_name: "address", value: compiledAddressString },
          ]
        },
        onSuccess: async (transaction: any) => {
          try {
            const response = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: transaction.reference,
                deliveryData: {
                  fullName: formData.fullName,
                  phone: formData.phone,
                  address: compiledAddressString
                },
              }),
            });

            if (response.ok) {
              const resData = await response.json();
              window.location.href = `/checkout/success?id=${resData.orderId}`;
            } else {
              setError("Payment was successful, but our database failed to save your order record. Please notify Al-Hikmah Support immediately.");
              setIsProcessing(false);
            }
          } catch (err) {
            setError("A network communication error blocked connection with our order verification server.");
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setError("Payment transaction canceled.");
          setIsProcessing(false);
        },
      });

    } catch (err: any) {
      console.error("Paystack system runtime execution breakdown:", err);
      setError(err?.message || "Could not spin up the secure checkout overlay panel frame.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* FORM INPUT WRAPPER COLUMN */}
      <form onSubmit={handlePaystackPayment} className="lg:col-span-7 space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-serif text-base font-bold text-slate-900">Delivery Information</h2>

        {error && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs font-medium text-rose-700 animate-in fade-in duration-200">
            <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Receiver Full Name</label>
          <input
            type="text"
            required
            placeholder="e.g., Kwame Mensah"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Mobile Money Phone Number</label>
          <input
            type="tel"
            required
            placeholder="e.g., 0540677535"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Step 1: Select Delivery Zone</label>
          <select
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
            value={formData.zoneId}
            onChange={(e) => handleZoneChange(e.target.value)}
          >
            <option value="">-- Choose your shipping zone --</option>
            {SHIPPING_ZONES.map((zone) => (
              <option key={zone.id} value={zone.id}>{zone.name}</option>
            ))}
          </select>
        </div>

        {selectedZone && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Step 2: Select Location</label>
            <select
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
              value={formData.specificLocation}
              onChange={(e) => setFormData({ ...formData, specificLocation: e.target.value })}
            >
              <option value="">-- Select Specific Town/Area --</option>
              {selectedZone.locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Step 3: Specific Landmark / Address Details</label>
          <textarea
            required
            rows={3}
            placeholder="e.g., Adjacent to the Star Assurance building, blue gate."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition resize-none"
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
          />
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs font-medium text-amber-800 leading-relaxed">
          ⚠️ <strong>Fulfillment Notice:</strong> Orders are processed in weekly batches. Delivery timelines vary by location. Customers will be contacted via phone after payment validation to finalize dispatch tracking.
        </div>
      </form>

            {/* DYNAMIC ORDER SUMMARY SIDEBAR COLUMN */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2.5">
          Order Summary ({totalItemsCount})
        </h3>
        
        <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto space-y-2 pr-1">
          {cartItems.map((item) => (
            <div key={item.id} className="pt-2 flex justify-between items-start text-xs gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="font-serif font-bold text-slate-900 truncate">{item.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="font-bold text-slate-800 flex-shrink-0">
                ₵{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Books Total</span>
            <span className="font-medium text-slate-800">GH₵ {bookTotalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Charge</span>
            <span className="font-medium text-slate-800">
              {shippingFee === 0 ? "FREE" : `GH₵ ${shippingFee.toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Total Payable</span>
            <p className="text-xl font-black text-emerald-900 mt-0.5">GH₵ {grandTotalPayable.toFixed(2)}</p>
          </div>
        </div>

        <button
          type="submit"
          onClick={handlePaystackPayment}
          disabled={isProcessing || cartItems.length === 0}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold py-3.5 px-6 rounded-xl shadow transition text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed mt-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying checkout info...</span>
            </>
          ) : (
            <span>Pay GH₵ {grandTotalPayable.toFixed(2)} with Paystack</span>
          )}
        </button>
      </div>

    </div>
  );
}
