import axios from "axios";
import Order from "../models/Order.js";

/**
 * Normalizes a customer phone number into international digit format required by Meta WhatsApp Cloud API.
 * e.g., "9876543210" -> "919876543210"
 * e.g., "+91 98765 43210" -> "919876543210"
 * e.g., "09876543210" -> "919876543210"
 *
 * @param {string|number} phone - Raw input phone number
 * @returns {string|null} Normalized phone string or null if invalid
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return null;

  // Convert to string and strip all non-digit characters
  let digits = String(phone).replace(/\D/g, "");

  if (!digits) return null;

  const defaultCountryCode = process.env.DEFAULT_COUNTRY_CODE || "91";

  // Standard 10-digit mobile number (e.g. Indian numbers)
  if (digits.length === 10) {
    digits = `${defaultCountryCode}${digits}`;
  }
  // 11-digit number starting with '0' (e.g. 09876543210)
  else if (digits.length === 11 && digits.startsWith("0")) {
    digits = `${defaultCountryCode}${digits.slice(1)}`;
  }

  // Check valid length range according to ITU E.164 (10 to 15 digits total)
  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  return digits;
};

/**
 * Sends an automated order confirmation message via Meta WhatsApp Cloud API.
 * This operation is isolated and non-blocking: any failure will be logged
 * without throwing an exception or causing the order creation flow to fail.
 *
 * @param {Object} order - Populated Mongoose order document
 * @returns {Promise<Object>} Status object indicating outcome
 */
export const sendWhatsAppOrderConfirmation = async (order) => {
  try {
    if (!order || !order._id) {
      console.warn("WhatsApp notification skipped: Invalid order object provided.");
      return { success: false, reason: "INVALID_ORDER" };
    }

    const orderId = order.orderNumber || String(order._id);

    // 1. Prevent duplicate notifications
    if (order.whatsappNotificationSent) {
      console.log(`WhatsApp confirmation already sent for order: ${orderId}`);
      return { success: true, reason: "ALREADY_SENT" };
    }

    // 2. Validate WhatsApp environment credentials
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || "v20.0";
    const templateName = process.env.WHATSAPP_ORDER_TEMPLATE_NAME || "order_confirmation";
    const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en";

    if (!accessToken || !phoneNumberId) {
      console.warn(
        `WhatsApp confirmation skipped for order ${orderId}: WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not configured in .env`
      );
      return { success: false, reason: "MISSING_CONFIG" };
    }

    // 3. Extract and normalize phone number
    const rawPhone = order.shippingAddress?.phone || order.user?.phone;
    const recipientPhone = normalizePhoneNumber(rawPhone);

    if (!recipientPhone) {
      console.warn(
        `WhatsApp confirmation skipped for order ${orderId}: Missing or invalid recipient phone number (${rawPhone})`
      );
      return { success: false, reason: "INVALID_PHONE" };
    }

    // 4. Prepare message order parameters
    const customerName = order.shippingAddress?.fullName || order.user?.fullName || "Customer";
    const totalAmount = `₹${order.totalAmount}`;
    const paymentStatus = order.paymentStatus || "PENDING";

    console.log(`Sending WhatsApp confirmation for order: ${orderId} to phone: ${recipientPhone}`);

    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    // 5. Build Meta Cloud API payload (Template format)
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientPhone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: templateLanguage,
        },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: String(customerName) },
              { type: "text", text: String(orderId) },
              { type: "text", text: String(totalAmount) },
              { type: "text", text: String(paymentStatus) },
            ],
          },
        ],
      },
    };

    // 6. Send HTTPS POST request to Meta API
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    const messageId = response.data?.messages?.[0]?.id;

    // 7. Atomically mark notification as sent in DB to avoid duplicate sends
    await Order.findByIdAndUpdate(order._id, {
      whatsappNotificationSent: true,
    });

    console.log(
      `WhatsApp confirmation sent successfully: ${orderId}${messageId ? ` (Message ID: ${messageId})` : ""}`
    );

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    const orderId = order?.orderNumber || order?._id || "Unknown";
    const errorMsg =
      error.response?.data?.error?.message ||
      error.response?.data ||
      error.message;

    console.error(`WhatsApp confirmation failed for order ${orderId}:`, errorMsg);

    // Return failure result cleanly without throwing exception
    return {
      success: false,
      error: errorMsg,
    };
  }
};
