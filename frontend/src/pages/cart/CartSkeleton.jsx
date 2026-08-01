import React from "react";
import { motion } from "framer-motion";

const CartSkeleton = () => {
  // Pulsing animation variant for elements
  const pulseVariant = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <motion.div
          variants={pulseVariant}
          initial="initial"
          animate="animate"
          className="h-4 w-12 bg-gray-200 rounded"
        />
        <span className="text-gray-300">/</span>
        <motion.div
          variants={pulseVariant}
          initial="initial"
          animate="animate"
          className="h-4 w-10 bg-gray-200 rounded"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Cart Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Progress Bar Skeleton */}
          <motion.div
            variants={pulseVariant}
            initial="initial"
            animate="animate"
            className="p-4 border border-red-100 rounded-md bg-red-50/30 space-y-3"
          >
            <div className="h-4 w-64 bg-gray-200 rounded" />
            <div className="h-2 w-full bg-gray-200 rounded-full" />
          </motion.div>

          {/* Cart Items Table Skeleton */}
          <div className="border border-gray-100 rounded-md p-4">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-xs font-semibold text-gray-400">
              <div className="col-span-6">PRODUCT</div>
              <div className="col-span-2 text-center">PRICE</div>
              <div className="col-span-2 text-center">QUANTITY</div>
              <div className="col-span-2 text-right">SUBTOTAL</div>
            </div>

            {/* Skeleton Cart Item Rows */}
            {[1, 2].map((item) => (
              <motion.div
                key={item}
                variants={pulseVariant}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0"
              >
                {/* Product Thumbnail & Title */}
                <div className="md:col-span-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md shrink-0" />
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                </div>

                {/* Price */}
                <div className="md:col-span-2 flex md:justify-center">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>

                {/* Quantity Input Box */}
                <div className="md:col-span-2 flex md:justify-center">
                  <div className="h-9 w-20 bg-gray-200 rounded border border-gray-100" />
                </div>

                {/* Subtotal & Delete Action */}
                <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="w-4 h-4 bg-gray-200 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coupon & Action Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
            <motion.div
              variants={pulseVariant}
              initial="initial"
              animate="animate"
              className="flex gap-2"
            >
              <div className="h-10 w-44 bg-gray-200 rounded-md" />
              <div className="h-10 w-28 bg-gray-200 rounded-md" />
            </motion.div>
            <motion.div
              variants={pulseVariant}
              initial="initial"
              animate="animate"
            >
              <div className="h-10 w-24 bg-gray-200 rounded-md" />
            </motion.div>
          </div>
        </div>

        {/* Right Column - Cart Totals Sidebar */}
        <div className="lg:col-span-4">
          <motion.div
            variants={pulseVariant}
            initial="initial"
            animate="animate"
            className="border border-gray-100 rounded-md p-6 space-y-6 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="h-6 w-28 bg-gray-200 rounded" />

            {/* Subtotal */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>

            {/* Shipping Info */}
            <div className="flex justify-between items-start pt-2 border-t border-gray-100">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="space-y-2 text-right">
                <div className="h-4 w-24 bg-gray-200 rounded ml-auto" />
                <div className="h-3 w-20 bg-gray-200 rounded ml-auto" />
                <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
              </div>
            </div>

            {/* Total Section */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="h-5 w-12 bg-gray-200 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>

            {/* Checkout Button */}
            <div className="h-12 w-full bg-gray-200 rounded-md mt-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;