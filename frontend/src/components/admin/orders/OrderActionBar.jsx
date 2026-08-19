import React from "react";
import { motion } from "framer-motion";
import { Truck, XCircle } from "lucide-react";

const nextStatusMap = {
  PLACED: "CONFIRMED",
  CONFIRMED: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

const OrderActi onBar = ({ order, onCancel, onUpdateStatus }) => {
  const isDelivered = order.orderStatus === "DELIVERED";

  const isCancelled =
    order.orderStatus === "CANCELLED" || Boolean(order.cancelledAt);

  const nextStatus = nextStatusMap[order.orderStatus] || null;

  const canUpdateTracking = !isCancelled && !isDelivered && Boolean(nextStatus);

  const canCancel = !isCancelled && !isDelivered;

  const actions = [
    {
      id: "tracking",
      label: "Update Tracking",
      icon: Truck,
      visible: canUpdateTracking,
    },
    {
      id: "cancel",
      label: "Cancel Order",
      icon: XCircle,
      danger: true,
      visible: canCancel,
    },
  ];

  const visibleActions = actions.filter((action) => action.visible);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      className="fixed bottom-6 right-6 z-[120] w-[250px] overflow-hidden rounded-2xl border
            border-white/80 bg-white/95 shadow-2xl backdrop-blur-xl"
      initial={{
        opacity: 0,
        scale: 0.65,
        x: 80,
        y: 80,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.65,
        x: 80,
        y: 80,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 24,
      }}
    >
      <div className="cursor-grab active:cursor-grabbing border-b border-slate-100 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Order Actions
        </p>

        <p className="mt-1 truncate text-sm font-bold text-slate-800">
          #{order.orderNumber}
        </p>
      </div>

      <div className="space-y-1 p-2">
        {visibleActions.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-slate-400">
            No actions available
          </div>
        ) : (
          visibleActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  if (action.id === "cancel") {
                    onCancel(order);
                  }

                  if (action.id === "tracking") {
                    onUpdateStatus(nextStatus);
                  }
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  action.danger
                    ? "text-red-500 hover:bg-red-50"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#0067B2]"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    action.danger
                      ? "bg-red-50 text-red-500"
                      : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#0067B2]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <span>{action.label}</span>
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default OrderActionBar;
