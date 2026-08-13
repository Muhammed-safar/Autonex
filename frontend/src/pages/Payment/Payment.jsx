import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowLeft, CreditCard } from "lucide-react";
import useCreatePaymentOrder from "../../hooks/payment/useCreatePaymentOrder";
import useVerifyPayment from "../../hooks/payment/useVerifyPayment";
import { useCreateOrder } from "../../hooks/orders/useCreateOrder";

const Payment = () => {
  const location = useLocation();

  const checkoutData = location.state?.checkoutData;

  const { mutate: createPaymentOrder, isPending: isCreatingPaymentOrder } =
    useCreatePaymentOrder();

  const { mutate: verifyPayment, isPending: isVerifyingPayment } =
    useVerifyPayment();

  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const [paymentError, setPaymentError] = useState("");

  // If user directly opens /payment without checkout data
  if (!checkoutData) {
    return <Navigate to="/checkout" replace />;
  }

  const { summary, items, shippingAddress, payment } = checkoutData;

  const {
    subtotal = 0,
    shipping = 0,
    tax = 0,
    discount = 0,
    total = 0,
  } = summary || {};

  const handlePayment = () => {
    if (!checkoutData?._id) {
      setPaymentError("Checkout information is missing.");
      return;
    }

    setPaymentError("");

    createPaymentOrder(
  {
    checkoutId: checkoutData._id,
  },
  {
      onSuccess: (response) => {
        console.log("Create Payment Order Response:", response);

        const paymentData = response.data;

        if (!paymentData?.orderId) {
          setPaymentError("Unable to create Razorpay payment order.");
          return;
        }

        if (!window.Razorpay) {
          setPaymentError("Razorpay SDK is not loaded.");
          return;
        }

        const options = {
          key: paymentData.key,

          amount: paymentData.amount,

          currency: paymentData.currency,

          name: "Autonex",

          description: "Order Payment",

          order_id: paymentData.orderId,

          prefill: {
            name: checkoutData.shippingAddress?.fullName || "",
            contact: checkoutData.shippingAddress?.phone || "",
          },

          theme: {
            color: "#0066b2",
          },

          handler: (razorpayResponse) => {
            console.log("Razorpay Payment Success:", razorpayResponse);

            verifyPayment(
              {
                checkoutId: checkoutData._id,

                razorpay_order_id: razorpayResponse.razorpay_order_id,

                razorpay_payment_id: razorpayResponse.razorpay_payment_id,

                razorpay_signature: razorpayResponse.razorpay_signature,
              },
              {
                onSuccess: (response) => {
                  console.log("Payment Verification Success:", response);

                  createOrder(
                    {
                      checkoutId: checkoutData._id,

                      paymentDetails: {
                        razorpayOrderId: razorpayResponse.razorpay_order_id,

                        razorpayPaymentId: razorpayResponse.razorpay_payment_id,

                        razorpaySignature: razorpayResponse.razorpay_signature,
                      },
                    },
                    {
                      onSuccess: (orderResponse) => {
                        console.log("✅ ORDER CREATED:", orderResponse);
                      },

                      onError: (error) => {
                        console.error(
                          "❌ ORDER CREATION FAILED:",
                          error.response?.data || error,
                        );
                      },
                    },
                  );
                },

                onError: (error) => {
                  console.error(
                    "Payment Verification Failed:",
                    error.response?.data?.message || error.message,
                  );
                },
              },
            );
          },

          modal: {
            ondismiss: () => {
              console.log("Razorpay payment window closed.");
            },
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();
      },

      onError: (error) => {
        console.error("Create Razorpay Order Failed:", error);

        setPaymentError(
          error.response?.data?.message || "Unable to start payment.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:underline">
            Home
          </Link>

          <span className="mx-1">/</span>

          <Link to="/checkout" className="hover:underline">
            Checkout
          </Link>

          <span className="mx-1">/</span>

          <span className="text-gray-800 font-medium">Payment</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0066b2] mb-2">
            Complete Your Payment
          </h1>

          <p className="text-xs text-gray-500">
            Review your order and continue to secure payment.
          </p>
        </div>

        {/* Main Layout */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* LEFT — ORDER SUMMARY */}
          <div className="md:col-span-5 bg-gray-50/70 border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
              Order Summary
            </h2>

            {/* Products */}
            <div className="space-y-3 mb-5">
              {items?.map((item) => (
                <div
                  key={item._id || item.productId}
                  className="flex justify-between gap-4 text-xs"
                >
                  <div>
                    <p className="font-medium text-gray-700">{item.name}</p>

                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>

                  <span className="font-semibold text-gray-700 whitespace-nowrap">
                    ${item.subtotal?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="space-y-2.5 text-xs border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>

                <span className="font-semibold text-gray-700">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>

                <span className="font-semibold text-gray-700">
                  ${shipping.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Tax</span>

                <span className="font-semibold text-gray-700">
                  ${tax.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>

                  <span className="font-semibold">-${discount.toFixed(2)}</span>
                </div>
              )}

              {/* Total */}
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
                <span className="font-bold text-gray-800">Total Amount</span>

                <span className="font-bold text-[#0066b2] text-base">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            {shippingAddress && (
              <div className="mt-6 pt-4 border-t border-gray-200/60">
                <h3 className="text-xs font-bold text-gray-800 mb-2">
                  Shipping Address
                </h3>

                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {shippingAddress.fullName}
                  <br />
                  {shippingAddress.addressLine1}
                  {shippingAddress.addressLine2 && (
                    <>
                      <br />
                      {shippingAddress.addressLine2}
                    </>
                  )}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country}
                </p>
              </div>
            )}

            {/* Trust Badge */}
            <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-2.5 text-gray-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />

              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>

          {/* RIGHT — RAZORPAY */}
          <div className="md:col-span-7">
            <div className="border border-gray-200 bg-white rounded-lg p-6">
              {/* Payment Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#0066b2]" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-gray-800">
                    Online Payment
                  </h2>

                  <p className="text-[11px] text-gray-500">
                    Secure payment via Razorpay
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gray-50 rounded-md p-5 text-center mb-5">
                <p className="text-[11px] text-gray-500 mb-1">Amount to Pay</p>

                <p className="text-2xl font-bold text-[#0066b2]">
                  ${total.toFixed(2)}
                </p>
              </div>

              {/* Description */}
              <div className="text-center mb-5">
                <p className="text-xs text-gray-600 leading-relaxed">
                  You will be redirected to Razorpay's secure checkout to
                  complete your payment.
                </p>

                <p className="text-[11px] text-gray-400 mt-2">
                  Cards • UPI • Net Banking • Wallets
                </p>
              </div>

              {/* Razorpay Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={isCreatingPaymentOrder || isVerifyingPayment}
                className="w-full bg-[#0066b2] hover:bg-[#005290] disabled:bg-gray-400 text-white text-xs font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />

                {isCreatingPaymentOrder
                  ? "Creating Payment..."
                  : isVerifyingPayment
                    ? "Verifying Payment..."
                    : `Pay $${total.toFixed(2)}`}
              </button>

              {paymentError && (
                <p className="mt-3 text-xs text-red-500 text-center">
                  {paymentError}
                </p>
              )}

              {/* Security */}
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />

                  <span>Secure and encrypted payment</span>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link
                to="/checkout"
                className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#0066b2] transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />

                <span>Back to Checkout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
