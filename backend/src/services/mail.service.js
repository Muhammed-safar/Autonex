import axios from "axios";

const brevoAPI = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": process.env.BREVO_API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const sendOTPEmail = async (email, otp) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing.");
  }

  if (!process.env.SENDER_EMAIL) {
    throw new Error("SENDER_EMAIL is missing.");
  }

  try {
    const response = await brevoAPI.post("/smtp/email", {
      sender: {
        name: process.env.SENDER_NAME || "Autonex",
        email: process.env.SENDER_EMAIL,
      },
      to: [
        {
          email,
        },
      ],
      subject: "Verify your Autonex account",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Welcome to Autonex 👋</h2>

          <p>Your verification code is:</p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
          ">
            ${otp}
          </div>

          <p style="margin-top:20px;">
            This code is valid for <strong>10 minutes</strong>.
          </p>

          <p>If you didn't request this email, you can safely ignore it.</p>

          <hr>

          <p style="font-size:12px;color:#777;">
            © ${new Date().getFullYear()} Autonex
          </p>
        </div>
      `,
    });


    return response.data;
  } catch (error) {
    console.error(
      "❌ Brevo Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to send OTP email.");
  }
};