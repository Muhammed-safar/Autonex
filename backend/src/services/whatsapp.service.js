import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";

import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_DIR = path.join(__dirname, "../../auth_info_baileys");

let sock = null;
let isStarting = false;

export const startWhatsApp = async () => {
  // Prevent duplicate sockets
  if (sock) {
    console.log("[WhatsApp] Socket already exists.");
    return sock;
  }

  if (isStarting) {
    console.log("[WhatsApp] Initialization already in progress.");
    return;
  }

  isStarting = true;

  try {
    console.log("[WhatsApp] Initializing Baileys...");

    const { state, saveCreds } =
      await useMultiFileAuthState(AUTH_DIR);

      const { version } = await fetchLatestBaileysVersion();

console.log(
  `[WhatsApp] Using WhatsApp Web version: ${version.join(".")}`
);

    sock = makeWASocket({
  version,
  auth: state,
  printQRInTerminal: false,
});

    // Save authentication whenever Baileys updates it
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      // QR generated
      if (qr) {
        console.log("[WhatsApp] Scan this QR code with WhatsApp:");
        qrcode.generate(qr, { small: true });
        console.log("[WhatsApp] Waiting for QR scan...");
      }

      // Connected
      if (connection === "open") {
        console.log("[WhatsApp] WhatsApp connected successfully!");
        isStarting = false;
      }

      // Connection closed
      if (connection === "close") {
  const statusCode =
    new Boom(lastDisconnect?.error)?.output?.statusCode;

  console.log(
    `[WhatsApp] Connection closed. Reason: ${statusCode}`
  );

  sock = null;
  isStarting = false;

  if (statusCode === DisconnectReason.loggedOut) {
    console.log(
      "[WhatsApp] Logged out. Please scan a new QR code."
    );
    return;
  }

  // 515 is expected after successful QR pairing.
  // WhatsApp requires the socket to restart using
  // the newly saved authentication credentials.
  if (statusCode === DisconnectReason.restartRequired) {
    console.log(
      "[WhatsApp] Restart required after pairing. Reconnecting..."
    );

    setTimeout(() => {
      startWhatsApp().catch((error) => {
        console.error(
          "[WhatsApp] Restart failed:",
          error
        );
      });
    }, 1000);

    return;
  }

  console.log("[WhatsApp] Connection closed.");
}
    });

    return sock;
  } catch (error) {
    console.error("[WhatsApp] Initialization failed:", error);

    sock = null;
    isStarting = false;

    throw error;
  }
};


export const sendWhatsAppMessage = async (phoneNumber, message) => {
  if (!sock) {
    throw new Error("WhatsApp is not connected");
  }

  if (!sock.user) {
    throw new Error("WhatsApp is not authenticated");
  }

  // Remove +, spaces, hyphens, etc.
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  const jid = `${cleanNumber}@s.whatsapp.net`;

  try {
    const result = await sock.sendMessage(jid, {
      text: message,
    });

    console.log(
      `[WhatsApp] Message sent successfully to ${cleanNumber}`
    );

    return result;
  } catch (error) {
    console.error(
      `[WhatsApp] Failed to send message to ${cleanNumber}:`,
      error
    );

    throw error;
  }
};