import React from "react";
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    MapPin,
    CreditCard,
    QrCode,
    ArrowLeft,
    Calendar,
    Phone,
    User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useOrder from "../../../hooks/orders/useOrder";
import { useDownloadInvoice } from "../../../hooks/orders/useDownloadInvoice";

const OrderDetailsPage = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const downloadInvoiceMutation = useDownloadInvoice();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useOrder(id);

    const orderData = data?.data;

    if (isLoading) {
        return <div>Loading order...</div>;
    }

    if (isError) {
        return (
            <div>
                {error?.response?.data?.message || "Failed to load order"}
            </div>
        );
    }

    if (!orderData) {
        return <div>Order not found</div>;
    }

    const isCancelled = orderData.orderStatus === "CANCELLED" || Boolean(orderData.cancelledAt);
    const showRefund = orderData.refundStatus && orderData.refundStatus !== "NOT_REQUIRED";

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusSteps = [
        "PLACED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
    ];

    const currentStep = statusSteps.indexOf(orderData.orderStatus);

    return (
        <div className="min-h-screen bg-slate-50  text-slate-600 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Navigation & Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-400 transition-colors w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Orders
                    </button>

                    <button
                        type="button"
                        onClick={() => downloadInvoiceMutation.mutate(orderData._id)}
                        disabled={downloadInvoiceMutation.isPending}
                        className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2.5 rounded-lg shadow-lg shadow-red-900/20 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />

                        {downloadInvoiceMutation.isPending
                            ? "Preparing Invoice..."
                            : "Download PDF Bill"}
                    </button>
                </div>

                {/* Top Summary Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-500">
                                    {orderData.orderNumber}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${isCancelled
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        }`}
                                >
                                    {orderData.orderStatus}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                Placed on {formatDate(orderData.createdAt)}
                            </p>
                        </div>

                        {/* Tracking ID Badge */}
                        {orderData.trackingId && (
                            <div className="bg-[#0067B2] border border-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-md">
                                <Truck className="w-5 h-5 text-white" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-white tracking-wider">
                                        Tracking ID
                                    </p>
                                    <p className="font-mono text-sm font-semibold text-gray-200">
                                        {orderData.trackingId}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cancelled / Refund Banner (Conditional) */}
                    {isCancelled && (
                        <div className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-900/50 flex items-start gap-3 text-red-300 text-sm">
                            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Order Cancelled</p>
                                {orderData.cancelledAt && (
                                    <p className="text-xs text-red-400 mt-0.5">
                                        Cancelled on {formatDate(orderData.cancelledAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {showRefund && (
                        <div className="mt-4 p-4 rounded-xl bg-amber-950/30 border border-amber-900/50 flex items-center gap-3 text-amber-300 text-sm">
                            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                            <div>
                                <span className="font-semibold">Refund Status: </span>
                                <span className="font-mono uppercase">{orderData.refundStatus}</span>
                            </div>
                        </div>
                    )}

                    {!isCancelled && (
                        <div className="mt-6 pt-2">
                            <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium text-slate-400">

                                {/* Placed */}
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= 0
                                            ? "bg-red-600 text-white"
                                            : "bg-slate-100 text-slate-400 border border-gray-100"
                                            }`}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>

                                    <span>Placed</span>
                                </div>


                                {/* Shipped */}
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= 1
                                            ? "bg-red-600 text-white"
                                            : "bg-slate-100 text-slate-400 border border-gray-100"
                                            }`}
                                    >
                                        <Truck className="w-4 h-4" />
                                    </div>

                                    <span>Shipped</span>
                                </div>


                                {/* Out For Delivery */}
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= 2
                                            ? "bg-red-600 text-white"
                                            : "bg-slate-100 text-slate-400 border border-gray-100"
                                            }`}
                                    >
                                        <Truck className="w-4 h-4" />
                                    </div>

                                    <span>Out for Delivery</span>
                                </div>


                                {/* Delivered */}
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep >= 3
                                            ? "bg-red-600 text-white"
                                            : "bg-slate-100 text-slate-400 border border-gray-100"
                                            }`}
                                    >
                                        <Package className="w-4 h-4" />
                                    </div>

                                    <span>Delivered</span>
                                </div>

                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Items & Totals (2 Cols wide) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Products Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-[#0067B2]" /> Purchased Items
                            </h2>

                            <div className="divide-y divide-slate-800   ">
                                {orderData.items.map((item, idx) => (
                                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-14 h-14 object-cover rounded-lg border border-gray-200 bg-gray-200 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-[#0067B2] shrink-0">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-medium text-slate-600 text-sm sm:text-base">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Qty: <span className="font-semibold text-slate-500">{item.quantity}</span> × ₹{item.price}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-700 text-sm sm:text-base">
                                                ₹{item.subtotal}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Summary */}
                        <div className="bg-white border-gray-100 rounded-2xl p-6 shadow-xl space-y-4">
                            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-red-500" /> Payment Summary
                            </h2>

                            <div className="space-y-2 text-sm pt-2">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="text-slate-700">₹{orderData.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Shipping Fee</span>
                                    <span className="text-slate-700">₹{orderData.shippingCharge}</span>
                                </div>
                                {orderData.discount > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Discount</span>
                                        <span>-₹{orderData.discount}</span>
                                    </div>
                                )}
                                <div className="border-t border-slate-800 pt-3 mt-3 flex justify-between font-bold text-base text-slate-800">
                                    <span>Total Amount</span>
                                    <span className="text-red-500">₹{orderData.totalAmount}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-2 gap-4 text-xs">
                                <div className="bg-slate-100 p-3 rounded-xl ">
                                    <span className="text-slate-500 block uppercase font-bold text-[10px] tracking-wider">Method</span>
                                    <span className="font-medium text-slate-700">{orderData.paymentMethod}</span>
                                </div>
                                <div className="bg-slate-100 p-3 rounded-xl">
                                    <span className="text-slate-500 block uppercase font-bold text-[10px] tracking-wider">Payment Status</span>
                                    <span className="font-medium text-amber-400">{orderData.paymentStatus}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Address & Verification QR */}
                    <div className="space-y-6">

                        {/* Shipping Details */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl space-y-4">
                            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" /> Shipping Details
                            </h2>

                            <div className="space-y-3 text-sm text-slate-300 pt-1">
                                <div className="flex items-center gap-2 font-medium text-slate-500">
                                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                                    <span>{orderData.shippingAddress.fullName}</span>
                                </div>

                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone className="w-4 h-4 text-slate-700 shrink-0" />
                                    <span>{orderData.shippingAddress.phone}</span>
                                </div>

                                <div className="border-t border-slate-800 pt-3 text-xs leading-relaxed text-slate-700">
                                    <p>{orderData.shippingAddress.addressLine1}</p>
                                    {orderData.shippingAddress.addressLine2 && (
                                        <p>{orderData.shippingAddress.addressLine2}</p>
                                    )}
                                    {orderData.shippingAddress.landmark && (
                                        <p className="text-slate-500 italic mt-0.5">
                                            Landmark: {orderData.shippingAddress.landmark}
                                        </p>
                                    )}
                                    <p className="mt-1 font-medium text-slate-500">
                                        {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-slate-500">{orderData.shippingAddress.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Verification Block */}
                        {orderData.qrCode && (
                            <div className="bg-white border-gray-100 rounded-2xl p-6 shadow-xl text-center space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
                                    <QrCode className="w-4 h-4 text-[#0067B2]" /> Package Pass Code
                                </h3>

                                <div className="p-3 bg-white rounded-xl inline-block shadow-inner border border-slate-200">
                                    <img
                                        src={orderData.qrCode}
                                        alt="Order QR Code"
                                        className="w-32 h-32 object-contain mx-auto"
                                    />
                                </div>

                                <p className="text-[11px] text-slate-500 leading-tight">
                                    Scan this code upon delivery for verification.
                                </p>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}

export default OrderDetailsPage