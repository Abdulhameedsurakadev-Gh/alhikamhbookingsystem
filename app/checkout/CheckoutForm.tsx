// app/checkout/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

interface CheckoutFormProps {
  userId: string;
  userEmail: string;
  totalAmount: number;
}

export function CheckoutForm({ userId, userEmail, totalAmount }: CheckoutFormProps): React.JSX.Element {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const handlePaystackPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    if (!formData.fullName || !formData.phone || !formData.address) {
      setError("Please fill in all delivery details.");
      return;
    }

    setIsProcessing(true);

    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Paystack Public Key is missing from your environment variables.");
      }

      // Lazy-loads the package purely inside browser client threads to prevent SSR crashes
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();
      
      paystack.newTransaction({
        key: publicKey,
        email: userEmail,
        // 🌟 DYNAMIC AMOUNT FIXED: Binds directly to the actual cart total, multiplied to Pesewas
        amount: Math.round(totalAmount * 100), 
        currency: "GHS",
        metadata: {
          custom_fields: [
            { display_name: "User ID", variable_name: "user_id", value: userId },
            { display_name: "Full Name", variable_name: "full_name", value: formData.fullName },
            { display_name: "Phone", variable_name: "phone", value: formData.phone },
            { display_name: "Address", variable_name: "address", value: formData.address },
          ]
        },
        onSuccess: async (transaction: any) => {
          try {
            // Forward transaction reference down to our lightning-fast sandbox bypass API route
            const response = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: transaction.reference,
                deliveryData: formData,
              }),
            });

            if (response.ok) {
              const resData = await response.json();
              // 🌟 REDIRECT ROUTING FIXED: Drives user straight into your checkout success route with the order identifier
              window.location.href = `/checkout/success?id=${resData.orderId}`;
            } else {
              setError("Payment was successful, but the system ran into an error saving your order. Please contact support.");
              setIsProcessing(false);
            }
          } catch (err) {
            setError("A network communication block occurred while validating your transaction.");
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setError("Payment transaction canceled.");
          setIsProcessing(false);
        },
      });

    } catch (err: any) {
      console.error("Paystack popup execution breakdown error:", err);
      setError(err?.message || "Could not mount the secure payment interface frame panel.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePaystackPayment} className="space-y-4">
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
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Full Shipping Address</label>
        <textarea
          required
          rows={3}
          placeholder="e.g., House No. 24, Near Al-Hikmah Mosque, Kasoa"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition resize-none"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold py-3.5 px-6 rounded-xl shadow transition text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed mt-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing Order Verification...</span>
          </>
        ) : (
          <span>Open Paystack Payment Window (GH₵ {totalAmount.toFixed(2)})</span>
        )}
      </button>
    </form>
  );
}
