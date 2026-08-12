import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    CheckCircle2,
    Download,
    Package,
    Home,
} from "lucide-react";
import { useDownloadInvoice } from "../../hooks/orders/useDownloadInvoice";

const OrderSuccess = () => {
    const location = useLocation();

    const order = location.state?.order;

    const downloadInvoiceMutation = useDownloadInvoice();

    // User reached this page directly without placing an order
    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                        Order information not found
                    </h2>

                    <p className="text-sm text-gray-500 mb-5">
                        We couldn't find the order details for this page.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-[#0066b2] text-white px-5 py-2.5 rounded-md text-sm font-semibold"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const handleDownloadInvoice = () => {
        if (!order?._id) {
            return;
        }

        downloadInvoiceMutation.mutate(order._id);
    };

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">

            <div className="max-w-6xl mx-auto">

                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-8 print:hidden">
                    <Link
                        to="/"
                        className="hover:underline"
                    >
                        Home
                    </Link>

                    <span className="mx-1">/</span>

                    <span className="text-gray-800 font-medium">
                        Order Confirmation
                    </span>
                </nav>

                <div className="max-w-2xl mx-auto">

                    {/* Success Header */}
                    <div className="text-center mb-8">

                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-[#0066b2] mb-2">
                            Order Placed Successfully!
                        </h1>

                        <p className="text-xs text-gray-500 leading-relaxed">
                            Thank you for your order. A confirmation email
                            has been sent to{" "}
                            <span className="font-semibold text-gray-700">
                                {order.user?.email}
                            </span>
                            .
                        </p>
                    </div>

                    {/* Order Box */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm mb-6">

                        {/* Order Reference */}
                        <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b border-gray-100 text-xs">

                            <div>
                                <span className="text-gray-400 block">
                                    Order Number
                                </span>

                                <span className="font-bold text-gray-800 text-sm">
                                    #{order.orderNumber}
                                </span>
                            </div>

                            <div className="text-right">
                                <span className="text-gray-400 block">
                                    Date
                                </span>

                                <span className="font-medium text-gray-700">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3 mb-6">

                            <span className="text-xs font-semibold text-gray-700 block">
                                Order Items
                            </span>

                            {order.items?.map((item, index) => (
                                <div
                                    key={item.productId || index}
                                    className="flex justify-between items-center text-xs py-2 border-b border-gray-50 last:border-0"
                                >
                                    <div className="text-gray-600">

                                        <span>
                                            {item.name}
                                        </span>

                                        <span className="text-gray-400 ml-2">
                                            × {item.quantity}
                                        </span>
                                    </div>

                                    <span className="font-semibold text-gray-800">
                                        ₹{item.subtotal}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Order Info + QR Code */}
                        <div className="pt-4 border-t border-gray-100 mb-6">

                            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-5">

                                {/* QR Code */}
                                <div className="flex flex-col items-center justify-center">

                                    {order.qrCode ? (
                                        <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                            <img
                                                src={order.qrCode}
                                                alt="Order QR Code"
                                                className="w-28 h-28 object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-28 h-28 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
                                            <span className="text-[10px] text-gray-400 text-center">
                                                QR unavailable
                                            </span>
                                        </div>
                                    )}

                                    <span className="text-[10px] text-gray-400 mt-2 text-center">
                                        Scan to track your order
                                    </span>

                                </div>


                                {/* Order Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

                                    {/* Payment Method */}
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">
                                            Payment Method
                                        </span>

                                        <span className="font-medium text-gray-700">
                                            {order.paymentMethod === "COD"
                                                ? "Cash on Delivery"
                                                : order.paymentMethod}
                                        </span>
                                    </div>


                                    {/* Payment Status */}
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">
                                            Payment Status
                                        </span>

                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                            {order.paymentStatus}
                                        </span>
                                    </div>


                                    {/* Order Status */}
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">
                                            Order Status
                                        </span>

                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {order.orderStatus}
                                        </span>
                                    </div>


                                    {/* Tracking ID */}
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">
                                            Tracking ID
                                        </span>

                                        <span className="font-medium text-gray-700 break-all">
                                            {order.trackingId}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-gray-50/70 p-4 rounded-md space-y-2 text-xs">

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span>
                                    ₹{order.subtotal}
                                </span>
                            </div>

                            {order.discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Discount
                                    </span>

                                    <span className="text-green-600">
                                        -₹{order.discount}
                                    </span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">

                                <span className="font-bold text-gray-800">
                                    Total Amount
                                </span>

                                <span className="font-bold text-base text-[#0066b2]">
                                    ₹{order.totalAmount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 print:hidden">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* Download */}
                            <button
                                type="button"
                                onClick={handleDownloadInvoice}
                                disabled={downloadInvoiceMutation.isPending}
                                className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-3 px-4 rounded-md transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />

                                <span>
                                    {downloadInvoiceMutation.isPending
                                        ? "Preparing Invoice..."
                                        : "Download Invoice"}
                                </span>
                            </button>

                            {/* Orders */}
                            <Link
                                to="/auth?tab=orders"
                                className="flex items-center justify-center gap-2 w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded-md transition-colors"
                            >
                                <Package className="w-3.5 h-3.5" />

                                <span>
                                    View My Orders
                                </span>
                            </Link>

                        </div>

                        <div className="text-center pt-2">

                            <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0066b2] transition-colors font-medium"
                            >
                                <Home className="w-3.5 h-3.5" />

                                <span>
                                    Back to Homepage
                                </span>
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;