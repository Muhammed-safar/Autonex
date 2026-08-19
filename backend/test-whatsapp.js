import "dotenv/config";
import {
  startWhatsApp,
  sendWhatsAppMessage,
} from "./src/services/whatsapp.service.js";

const phoneNumber = "919567027791";

const message =
  "Hello from Autonex! 🚀 WhatsApp integration is working.";

try {
  await startWhatsApp();

  // Give Baileys a moment to establish the connection
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await sendWhatsAppMessage(phoneNumber, message);

  console.log("✅ Test message sent");
  process.exit(0);
} catch (error) {
  console.error("❌ WhatsApp test failed:", error);
  process.exit(1);
}