import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import pino from "pino";
import path from "path";
import fs from "fs";
import Order from "../models/Order.js";

// Session persistence directory
const AUTH_DIR = path.resolve(process.cwd(), "auth_info_baileys");

let sock = null;
let isConnected = false;
let isInitializing = false;
let initPromise = null;
let reconnectTimer = null;
let lastPrintedQR = null;

/**
 * Ensures the auth directory exists.
 */
const ensureAuthDir = () => {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
};

/**
 * Clears saved authentication credentials (used on logout/bad session).
 */
const clearAuthDirectory = () => {
  try {
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      console.log("[WhatsApp] Auth directory cleared.");
    }
  } catch (err) {
    console.error("[WhatsApp] Error clearing auth directory:", err.message);
  }
};

/**
 * Safely cleans up the existing Baileys socket instance and listeners.
 */
const cleanupSocket = () => {
  if (sock) {
    try {
      sock.ev.removeAllListeners();
      if (sock.ws) {
        sock.ws.close();
      }
      if (sock.end) {
        sock.end(undefined);
      }
    } catch (e) {
      // Ignore socket closing errors
    }
    sock = null;
  }
  isConnected = false;
  isInitializing = false;
};

/**
 * Schedules a reconnect attempt with a safe backoff delay, preventing duplicate timers.
 */
const scheduleReconnect = (delayMs = 5000) => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    initWhatsApp().catch((err) => {
      console.error("[WhatsApp] Reconnect failed:", err.message);
    });
  }, delayMs);
};

/**
 * Normalizes customer phone number into WhatsApp JID format.
 * e.g., "9876543210" -> "919876543210@s.whatsapp.net"
 * e.g., "+91 98765 43210" -> "919876543210@s.whatsapp.net"
 * e.g., "09876543210" -> "919876543210@s.whatsapp.net"
 *
 * @param {string|number} phone
 * @returns {string|null} WhatsApp JID string or null if invalid
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return null;

  let digits = String(phone).replace(/\D/g, "");
  if (!digits) return null;

  const defaultCountryCode = process.env.DEFAULT_COUNTRY_CODE || "91";

  if (digits.length === 10) {
    digits = `${defaultCountryCode}${digits}`;
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = `${defaultCountryCode}${digits.slice(1)}`;
  }

  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  return `${digits}@s.whatsapp.net`;
};

/**
 * Initializes shared Baileys WhatsApp connection with single-instance locking.
 */
export const initWhatsApp = async () => {
  if (sock && isConnected) {
    return sock;
  }

  if (initPromise) {
    return initPromise;
  }

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  initPromise = (async () => {
    isInitializing = true;
    console.log("[WhatsApp] Initializing Baileys connection...");

    try {
      ensureAuthDir();
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

      let version = [2, 3000, 1015901307];
      try {
        const fetchedVersion = await fetchLatestBaileysVersion();
        if (fetchedVersion?.version) {
          version = fetchedVersion.version;
        }
      } catch {
        // Fallback to default version if fetch fails
      }

      // Cleanup any previous socket instance before creating a new one
      cleanupSocket();

      const browserSetting = typeof Browsers?.ubuntu === "function"
        ? Browsers.ubuntu("Chrome")
        : ["Autonex Backend", "Chrome", "120.0.0"];

      sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        browser: browserSetting,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        retryRequestDelayMs: 2000,
      });

      sock.ev.on("creds.update", saveCreds);

      sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && qr !== lastPrintedQR) {
          lastPrintedQR = qr;
          console.log("\n=======================================================");
          console.log("[WhatsApp] Scan this QR code with your WhatsApp app:");
          console.log("=======================================================\n");
          qrcode.generate(qr, { small: true });
          console.log("\n[WhatsApp] Waiting for QR scan...\n");
        }

        if (connection === "close") {
          isConnected = false;
          isInitializing = false;
          lastPrintedQR = null;

          const statusCode = lastDisconnect?.error?.output?.statusCode;
          console.log(`[WhatsApp] Connection closed (Reason code: ${statusCode || "unknown"})`);

          // Distinguish disconnect reasons
          if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
            console.log("[WhatsApp] Session logged out. Clearing auth directory for fresh QR scan...");
            cleanupSocket();
            clearAuthDirectory();
            scheduleReconnect(5000);
          } else if (statusCode === DisconnectReason.badSession || statusCode === 500) {
            console.log("[WhatsApp] Bad session state detected. Resetting auth directory...");
            cleanupSocket();
            clearAuthDirectory();
            scheduleReconnect(5000);
          } else if (statusCode === DisconnectReason.connectionReplaced || statusCode === 440) {
            console.warn("[WhatsApp] Connection replaced by another session. Auto-reconnect stopped.");
            cleanupSocket();
          } else if (statusCode === DisconnectReason.restartRequired || statusCode === 515) {
            console.log("[WhatsApp] Server requested stream restart. Reconnecting quickly...");
            cleanupSocket();
            scheduleReconnect(1000);
          } else {
            // Transient 408 (timeout), 428 (precondition required), network drops
            console.log("[WhatsApp] Transient connection drop. Reconnecting in 5 seconds...");
            cleanupSocket();
            scheduleReconnect(5000);
          }
        } else if (connection === "open") {
          isConnected = true;
          isInitializing = false;
          lastPrintedQR = null;
          console.log("[WhatsApp] WhatsApp connected successfully!");
        }
      });

      return sock;
    } catch (error) {
      isInitializing = false;
      isConnected = false;
      console.error("[WhatsApp] Initialization error:", error.message);
      cleanupSocket();
      scheduleReconnect(10000);
      return null;
    }
  })().finally(() => {
    initPromise = null;
  });

  return initPromise;
};

/**
 * Returns current WhatsApp connection status.
 */
export const getWhatsAppStatus = () => {
  return {
    isConnected,
    isInitializing,
  };
};

/**
 * Sends an automated order confirmation message via Baileys.
 * Non-blocking: fails gracefully without throwing errors or breaking order creation.
 *
 * @param {Object} order - Populated Mongoose order document
 * @returns {Promise<Object>} Status object
 */
export const sendWhatsAppOrderConfirmation = async (order) => {
  try {
    if (!order || !order._id) {
      console.warn("[WhatsApp] Notification skipped: Invalid order provided.");
      return { success: false, reason: "INVALID_ORDER" };
    }

    const orderId = order.orderNumber || String(order._id);

    // 1. Check duplicate prevention
    if (order.whatsappNotificationSent) {
      console.log(`[WhatsApp] Order confirmation already sent for order: ${orderId}`);
      return { success: true, reason: "ALREADY_SENT" };
    }

    // 2. Check connection status
    if (!sock || !isConnected) {
      console.warn(
        `[WhatsApp] Notification skipped for order ${orderId}: WhatsApp is not connected.`
      );
      // Attempt background connection for future orders
      initWhatsApp().catch(() => {});
      return { success: false, reason: "NOT_CONNECTED" };
    }

    // 3. Normalize phone number to WhatsApp JID
    const rawPhone = order.shippingAddress?.phone || order.user?.phone;
    const jid = normalizePhoneNumber(rawPhone);

    if (!jid) {
      console.warn(
        `[WhatsApp] Notification skipped for order ${orderId}: Invalid phone number (${rawPhone})`
      );
      return { success: false, reason: "INVALID_PHONE" };
    }

    // 4. Verify number is registered on WhatsApp
    try {
      const results = await sock.onWhatsApp(jid);
      const targetUser = Array.isArray(results) ? results[0] : null;

      if (!targetUser || !targetUser.exists) {
        console.warn(
          `[WhatsApp] Notification skipped for order ${orderId}: Phone number (${rawPhone}) is not registered on WhatsApp.`
        );
        return { success: false, reason: "NOT_ON_WHATSAPP" };
      }
    } catch (verifError) {
      console.warn(
        `[WhatsApp] Verification check warning for order ${orderId}:`,
        verifError.message
      );
    }

    // 5. Construct order confirmation message
    const customerName =
      order.shippingAddress?.fullName || order.user?.fullName || "Customer";
    const totalAmount = order.totalAmount ? `₹${order.totalAmount}` : "N/A";
    const paymentStatus = order.paymentStatus || "PENDING";

    const messageText = `Hi ${customerName} 👋\n\nThank you for shopping with Autonex! 🎉\n\nYour order has been successfully placed.\n\nOrder ID: ${orderId}\nTotal Amount: ${totalAmount}\nPayment Status: ${paymentStatus}\n\nWe'll keep you updated about your order status.\n\nThank you for choosing Autonex! ❤️`;

    console.log(`[WhatsApp] Sending order confirmation for order: ${orderId}`);

    // 6. Send message
    await sock.sendMessage(jid, { text: messageText });

    // 7. Update whatsappNotificationSent boolean in DB
    await Order.findByIdAndUpdate(order._id, {
      whatsappNotificationSent: true,
    });

    console.log(`[WhatsApp] Message sent successfully for order: ${orderId}`);

    return {
      success: true,
    };
  } catch (error) {
    const orderId = order?.orderNumber || order?._id || "Unknown";
    console.error(
      `[WhatsApp] Failed to send message for order: ${orderId}:`,
      error.message
    );

    // Non-blocking: Return failure object gracefully
    return {
      success: false,
      error: error.message,
    };
  }
};

// Graceful process shutdown cleanup
process.on("SIGINT", () => {
  cleanupSocket();
});
process.on("SIGTERM", () => {
  cleanupSocket();
});
