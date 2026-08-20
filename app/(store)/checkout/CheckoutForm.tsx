"use client";

import { useState, useMemo } from "react";
import { Loader2, ShieldAlert, AlertTriangle } from "lucide-react";
import { SHIPPING_ZONES, type ShippingZone } from "../../../lib/shipping-zones";
import { useCartStore } from "../../../store/useCartStore";

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

// Ghana mobile prefixes.
const GHANA_PHONE_REGEX = /^0[2345][0-9]{8}$/;

export function CheckoutForm({
  userId,
  userEmail,
  cartItems,
}: CheckoutFormProps): React.JSX.Element {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedZone, setSelectedZone] =
    useState<ShippingZone | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    zoneId: "",
    specificLocation: "",
    landmark: "",
  });

  const bookTotalAmount = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
  }, [cartItems]);

  const shippingFee = selectedZone ? selectedZone.fee : 0;
  const grandTotalPayable = bookTotalAmount + shippingFee;

  const handleZoneChange = (zoneId: string) => {
    const zone =
      SHIPPING_ZONES.find((z) => z.id === zoneId) || null;

    setSelectedZone(zone);

    setFormData({
      ...formData,
      zoneId,
      specificLocation: "",
    });
  };

  const handlePaystackPayment = async (
    e: React.FormEvent
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.zoneId ||
      !formData.specificLocation ||
      !formData.landmark
    ) {
      setError(
        "Please fill in all your specific delivery steps and recipient information."
      );
      return;
    }

    if (!GHANA_PHONE_REGEX.test(formData.phone.trim())) {
      setError(
        "Please enter a valid Ghana mobile number (e.g., 0540677535)."
      );
      return;
    }

    if (!userEmail || !userEmail.includes("@")) {
      setError(
        "Your account is missing a valid email address. Please update your profile before checking out."
      );
      return;
    }

    if (cartItems.length === 0) {
      setError(
        "Your cart is empty. Please return to your cart and select your books again."
      );
      return;
    }

    setIsProcessing(true);

    try {
      const publicKey =
        process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error(
          "Paystack Public Key is missing from your environment variables."
        );
      }

      const { default: PaystackPop } = await import(
        "@paystack/inline-js"
      );

      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: publicKey,
        email: userEmail,
        amount: Math.round(grandTotalPayable * 100),
        currency: "GHS",

        metadata: {
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: userId,
            },
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: formData.fullName,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: formData.phone,
            },
          ],
        },

        onSuccess: async (transaction: any) => {
          try {
            const response = await fetch(
              "/api/checkout/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  reference: transaction.reference,

                  deliveryData: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    zoneId: selectedZone?.id ?? null,
                    zoneName: selectedZone?.name ?? null,
                    shippingFee,
                    specificLocation:
                      formData.specificLocation,
                    landmark: formData.landmark,
                  },
                }),
              }
            );

            const resData = await response.json();

            if (!response.ok || !resData.success) {
              setError(
                resData?.error ||
                  "Payment was successful, but our database failed to save your order record. Please notify Al-Hikmah Support immediately."
              );

              setIsProcessing(false);
              return;
            }

            if (!resData.orderId) {
              console.error(
                "Checkout verification succeeded without an order ID:",
                resData
              );

              setError(
                "Payment was successful, but we could not retrieve your order confirmation. Please contact Al-Hikmah Support."
              );

              setIsProcessing(false);
              return;
            }

            /*
             * IMPORTANT:
             *
             * At this point the server has already:
             *
             * 1. Verified the Paystack transaction.
             * 2. Verified the expected payment amount.
             * 3. Created the order.
             * 4. Deleted the authenticated user's database cart items.
             *
             * The remaining cart state is the browser's Zustand
             * persistent cart.
             *
             * Clear it now so localStorage cannot restore the old
             * purchased books when the customer returns to /cart.
             */
            useCartStore.getState().clearCart();

            /*
             * Only redirect after BOTH sides of the cart have been
             * synchronized:
             *
             * PostgreSQL cart → empty
             * Zustand/localStorage cart → empty
             */
            window.location.href = `/checkout/success?id=${resData.orderId}`;
          } catch (verificationError) {
            console.error(
              "Checkout verification request failed:",
              verificationError
            );

            setError(
              "A network communication error blocked connection with our order verification server."
            );

            setIsProcessing(false);
          }
        },

        onCancel: () => {
          setError("Payment transaction canceled.");
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      console.error("Paystack checkout error:", err);

      setError(
        err?.message ||
          "Could not open the secure checkout panel."
      );

      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      <form
        id="checkout-form"
        onSubmit={handlePaystackPayment}
        className="lg:col-span-7 space-y-4 bg-card border border-border rounded-md p-5"
      >
        <h2 className="font-serif text-base font-bold text-foreground">
          Delivery Information
        </h2>

        {error && (
          <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 p-3 rounded-sm text-xs font-medium text-destructive animate-in fade-in duration-200">
            <ShieldAlert
              className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />

            <span>{error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="checkout-name"
            className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1"
          >
            Receiver Full Name
          </label>

          <input
            id="checkout-name"
            type="text"
            required
            disabled={isProcessing}
            placeholder="e.g., Kwame Mensah"
            className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({
                ...formData,
                fullName: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label
            htmlFor="checkout-phone"
            className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1"
          >
            Mobile Money Phone Number
          </label>

          <input
            id="checkout-phone"
            type="tel"
            required
            disabled={isProcessing}
            placeholder="e.g., 0540677535"
            className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label
            htmlFor="checkout-zone"
            className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1"
          >
            Step 1: Select Delivery Zone
          </label>

          <select
            id="checkout-zone"
            required
            disabled={isProcessing}
            className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
            value={formData.zoneId}
            onChange={(e) =>
              handleZoneChange(e.target.value)
            }
          >
            <option value="">
              -- Choose your shipping zone --
            </option>

            {SHIPPING_ZONES.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>

        {selectedZone && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-normal">
            <label
              htmlFor="checkout-location"
              className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1"
            >
              Step 2: Select Location
            </label>

            <select
              id="checkout-location"
              required
              disabled={isProcessing}
              className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
              value={formData.specificLocation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specificLocation: e.target.value,
                })
              }
            >
              <option value="">
                -- Select Specific Town/Area --
              </option>

              {selectedZone.locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor="checkout-landmark"
            className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1"
          >
            Step 3: Specific Landmark / Address Details
          </label>

          <textarea
            id="checkout-landmark"
            required
            disabled={isProcessing}
            rows={3}
            placeholder="e.g., Adjacent to the Star Assurance building, blue gate."
            className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50 resize-none"
            value={formData.landmark}
            onChange={(e) =>
              setFormData({
                ...formData,
                landmark: e.target.value,
              })
            }
          />
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-sm p-3 text-xs font-medium text-warning leading-relaxed flex gap-2">
          <AlertTriangle
            className="h-4 w-4 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />

          <span>
            <strong>Fulfillment Notice:</strong> Orders are
            processed in weekly batches. Delivery timelines vary
            by location. We&apos;ll contact you by phone after
            payment to confirm dispatch.
          </span>
        </div>
      </form>

      <div className="lg:col-span-5 bg-card border border-border rounded-md p-5 space-y-4">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider border-b border-border pb-2.5">
          Order Summary ({totalItemsCount})
        </h3>

        <div className="divide-y divide-border max-h-48 overflow-y-auto space-y-2 pr-1">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="pt-2 flex justify-between items-start text-xs gap-4"
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-serif font-bold text-foreground truncate">
                  {item.title}
                </h4>

                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>

              <span className="font-bold text-foreground flex-shrink-0">
                ₵{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Books Total</span>

            <span className="font-medium text-foreground">
              GH₵ {bookTotalAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Charge</span>

            <span className="font-medium text-foreground">
              {shippingFee === 0
                ? "FREE"
                : `GH₵ ${shippingFee.toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-3 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Total Payable
            </span>

            <p className="text-title font-black text-primary mt-0.5">
              GH₵ {grandTotalPayable.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          type="submit"
          form="checkout-form"
          disabled={
            isProcessing || cartItems.length === 0
          }
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3.5 px-6 rounded-sm transition-colors duration-fast ease-standard text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed mt-2"
        >
          {isProcessing ? (
            <>
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />

              <span>Opening secure payment...</span>
            </>
          ) : (
            <span>
              Pay GH₵ {grandTotalPayable.toFixed(2)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}