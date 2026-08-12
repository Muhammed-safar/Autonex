import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ShieldCheck, X } from "lucide-react";
import { useCreateOrder } from "../../hooks/orders/useCreateOrder"

/**
 * ConfirmOrderModal Component
 * 
 * @param {boolean} isOpen - Controls visibility of the modal
 * @param {function} onClose - Function to close modal without submitting
 * @param {function} onConfirm - Function triggered when user clicks "Confirm & Pay"
 * @param {boolean} isProcessing - Loading state during payment execution
 * @param {object} orderDetails - Object containing bill breakdown & payment info
 */
const ConfirmOrderModal = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const createOrderMutation = useCreateOrder();

    const checkoutData = location.state?.checkoutData;

    if (!checkoutData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Checkout information not found.</p>
            </div>
        );
    }
    const handleSubmitOrder = () => {
        if (!checkoutData._id) {
            console.error("Checkout ID is missing");
            return;
        }

        createOrderMutation.mutate({
            checkoutId: checkoutData._id,
        });
    };

    return (
        <div className="flex items-center justify-center p-16 backdrop-blur-xs transition-opacity font-sans">
            {/* Modal Container */}
            <div
                className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-md overflow-hidden transform transition-all"
                role="dialog"
                aria-modal="true"
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#0066b2]">
                        Confirm Your Payment
                    </h2>
                    <button
                        type="button"
                        onClick={()=>navigate(-1)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Please review your final transaction details before processing.
                    </p>

                    {/* Details Summary Card */}
                    <div className="bg-gray-50/80 rounded-md border border-gray-100 p-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Payment Method</span>
                            <span className="font-semibold text-gray-800">
                                {checkoutData.payment.method}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Items</span>
                            <span className="font-medium text-gray-700 truncate max-w-[180px]">
                                {checkoutData.items.length}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium text-gray-700">
                                {checkoutData.summary.subtotal}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Shipping Charge</span>
                            <span className="font-medium text-gray-700">
                                {checkoutData.summary.shipping}
                            </span>
                        </div>

                        <div className="pt-2.5 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-800">
                                Total Charge
                            </span>
                            <span className="text-base font-bold text-[#0066b2]">
                                {checkoutData.summary.total}
                            </span>
                        </div>
                    </div>

                    {/* Notice Alert */}
                    <div className="flex items-start gap-2.5 p-3 rounded-md bg-amber-50/60 border border-amber-200/60 text-amber-800 text-[11px] leading-tight">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                            By clicking confirm, your order will be placed using your selected payment method.
                        </span>
                    </div>
                </div>

                {/* Modal Footer / Actions */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 space-y-3">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={()=>navigate(-1)}
                            className="w-1/2 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-md transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmitOrder}
                            disabled={createOrderMutation.isPending}
                            className="w-1/2 bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-2.5 px-4 rounded-md transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {createOrderMutation.isPending ? "Processing..." : "Confirm Order"}
                        </button>
                    </div>

                    {/* Security Indicator */}
                    <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Encrypted 256-bit secure checkout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrderModal;