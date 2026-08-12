import Cart from "../models/Cart.js";
import Checkout from "../models/Checkout.js";

const SHIPPING_CHARGE = Number(process.env.SHIPPING_CHARGE || 80);
const FREE_SHIPPING_LIMIT = Number(
  process.env.FREE_SHIPPING_LIMIT || 1000
);
const GST_PERCENT = Number(process.env.GST_PERCENT || 18);

const COUPON_CODE = process.env.COUPON_CODE;
const COUPON_DISCOUNT = Number(process.env.COUPON_DISCOUNT || 0);
const COUPON_ENABLED = process.env.COUPON_ENABLED === "true";

export const checkoutService = async (userId, body) => {
  const {
    paymentMethod,
    couponCode,
    shippingAddress,
  } = body;

  // Payment Validation
  const allowedPayments = ["COD", "RAZORPAY"];

  if (!allowedPayments.includes(paymentMethod)) {
    throw new Error("Choose a payment method");
  }

  // Address Validation
  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.addressLine1 ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    throw new Error("Shipping address is required");
  }

  // Cart
  const cart = await Cart.findOne({
    userId,
  }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Price Calculation
  let subtotal = 0;

  const items = [];

  for (const item of cart.items) {
    const product = item.productId;

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error(`${product.name} is unavailable`);
    }

    let price;
    let stock;

    // Variant Product
    if (item.variantId) {
      const variant = product.variants.id(item.variantId);

      if (!variant) {
        throw new Error("Variant not found");
      }

      stock = variant.stock;

      price =
        variant.discountPrice > 0
          ? variant.discountPrice
          : variant.price;
    }

    // Normal Product
    else {
      stock = product.stock;

      price =
        product.discountPrice > 0
          ? product.discountPrice
          : product.price;
    }

    // Stock Validation
    if (stock < item.quantity) {
      throw new Error(`${product.name} is out of stock`);
    }

    const itemSubtotal = price * item.quantity;

    subtotal += itemSubtotal;

    items.push({
      productId: product._id,
      variantId: item.variantId || null,
      name: product.name,
      image: product.images?.[0]?.url || "",
      quantity: item.quantity,
      price,
      subtotal: itemSubtotal,
    });
  }

  // Shipping
  const shipping =
    subtotal >= FREE_SHIPPING_LIMIT
      ? 0
      : SHIPPING_CHARGE;

  // GST
  const tax = Number(
    ((subtotal * GST_PERCENT) / 100).toFixed(2)
  );

  // Coupon
  let discount = 0;
  let appliedCoupon = null;

  // Coupons disabled by admin
  if (!COUPON_ENABLED) {
    discount = 0;
    appliedCoupon = null;
  }

  // Coupons enabled
  else {
    // No coupon entered
    if (!couponCode || couponCode.trim() === "") {
      discount = 0;
      appliedCoupon = null;
    }

    // Coupon entered
    else {
      if (
        couponCode.trim().toUpperCase() !==
        COUPON_CODE?.toUpperCase()
      ) {
        throw new Error("Wrong coupon code");
      }

      discount = Number(
        ((subtotal * COUPON_DISCOUNT) / 100).toFixed(2)
      );

      appliedCoupon = {
        code: COUPON_CODE,
        percentage: COUPON_DISCOUNT,
      };
    }
  }

  // Total
  const total =
    subtotal +
    shipping +
    tax -
    discount;

  // --------------------------------------------------
  // CREATE A COMPLETELY NEW CHECKOUT SESSION
  // --------------------------------------------------

  const checkout = await Checkout.create({
    user: userId,

    items,

    shippingAddress,

    payment: {
      method: paymentMethod,
      status: "PENDING",
    },

    coupon: appliedCoupon,

    summary: {
      subtotal,
      shipping,
      tax,
      discount,
      total,
    },

    checkoutStatus: "ACTIVE",

    // Checkout valid for 30 minutes
    expiresAt: new Date(
      Date.now() + 30 * 60 * 1000
    ),
  });

  // --------------------------------------------------
  // RETURN CHECKOUT RESULT
  // --------------------------------------------------

  return {
    success: true,

    nextStep:
      paymentMethod === "RAZORPAY"
        ? "PAYMENT"
        : "CREATE_ORDER",

    checkout,
  };
};