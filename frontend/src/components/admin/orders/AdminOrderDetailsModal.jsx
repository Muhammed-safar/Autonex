import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Package,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
} from "lucide-react";
import OrderActionBar from "./OrderActionBar";
import useCancelOrder from "../../../hooks/orders/useCancelOrder";
import useUpdateOrderStatus from "../../../hooks/orders/useUpdateOrderStatus";

const AdminOrderDetailsModal = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const cancelOrderMutation = useCancelOrder();
  const updateStatusMutation = useUpdateOrderStatus();

  const isCancelled =
    order.orderStatus === "CANCELLED" ||
    Boolean(order.cancelledAt);

  const statusSteps = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const currentStep = statusSteps.indexOf(order.orderStatus);

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

  const handleCancelOrder = (order) => {
    cancelOrderMutation.mutate(order._id);
  };

  const handleUpdateStatus = (status) => {
    updateStatusMutation.mutate({
      orderId: order._id,
      status,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKDROP */}

          <motion.div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* ORDER DETAILS */}

          <motion.div
            className="
              relative
              z-10
              w-full
              max-w-5xl
              max-h-[90vh]
              overflow-hidden
              rounded-2xl
              bg-slate-50
              shadow-2xl
            "
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 70,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.88,
              y: 70,
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 25,
            }}
          >
            {/* HEADER */}

            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-800">
                    Order Details
                  </h2>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0067B2]">
                    #{order.orderNumber}
                  </span>
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />

                  {formatDate(order.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-500
                  transition
                  hover:bg-slate-200
                  hover:text-slate-800
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* CONTENT */}

            <div className="max-h-[calc(90vh-73px)] overflow-y-auto p-6">
              <div className="space-y-6">

                {/* STATUS */}

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Order Status
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-800">
                        {order.orderStatus}
                      </p>
                    </div>

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        ${isCancelled
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-600"
                        }
                      `}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* TRACKING TIMELINE */}

                  {!isCancelled && (
                    <div className="mt-8 grid grid-cols-5 gap-2">
                      {statusSteps.map((status, index) => {
                        const completed = currentStep >= index;

                        return (
                          <div
                            key={status}
                            className="flex flex-col items-center gap-2"
                          >
                            <div
                              className={`
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                ${completed
                                  ? "bg-green-600 text-white"
                                  : "border border-slate-200 bg-slate-50 text-slate-300"
                                }
                              `}
                            >
                              {status === "SHIPPED" ||
                                status === "OUT_FOR_DELIVERY" ? (
                                <Truck className="h-4 w-4" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </div>

                            <span className="text-center text-[10px] font-medium text-slate-400">
                              {status.replaceAll("_", " ")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* CUSTOMER */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <User className="h-4 w-4 text-[#0067B2]" />
                      Customer
                    </h3>

                    <div className="space-y-3 text-sm">
                      <p className="font-semibold text-slate-700">
                        {order.shippingAddress?.fullName ||
                          order.user?.name ||
                          "N/A"}
                      </p>

                      <p className="flex items-center gap-2 text-slate-500">
                        <Phone className="h-4 w-4" />

                        {order.shippingAddress?.phone ||
                          order.user?.phone ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT */}

                  <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <CreditCard className="h-4 w-4 text-[#0067B2]" />
                      Payment
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Method
                        </span>

                        <span className="font-semibold text-slate-700">
                          {order.paymentMethod || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Status
                        </span>

                        <span className="font-semibold text-slate-700">
                          {order.paymentStatus || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-slate-100 pt-3">
                        <span className="font-semibold text-slate-600">
                          Total
                        </span>

                        <span className="font-bold text-[#0067B2]">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRODUCTS */}

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Package className="h-4 w-4 text-[#0067B2]" />
                    Purchased Items
                  </h3>

                  <div className="divide-y divide-slate-100">
                    {order.items?.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
                              <Package className="h-6 w-6 text-slate-400" />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-700">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>

                        <p className="font-bold text-slate-700">
                          ₹{item.subtotal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SHIPPING */}

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <MapPin className="h-4 w-4 text-[#0067B2]" />
                    Shipping Address
                  </h3>

                  <div className="space-y-1 text-sm text-slate-500">
                    <p className="font-semibold text-slate-700">
                      {order.shippingAddress?.fullName}
                    </p>

                    <p>
                      {order.shippingAddress?.addressLine1}
                    </p>

                    {order.shippingAddress?.addressLine2 && (
                      <p>
                        {order.shippingAddress.addressLine2}
                      </p>
                    )}

                    <p>
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.postalCode}
                    </p>

                    <p>
                      {order.shippingAddress?.country}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* FLOATING ACTION BAR */}

          <OrderActionBar
            order={order}
            onCancel={handleCancelOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminOrderDetailsModal;