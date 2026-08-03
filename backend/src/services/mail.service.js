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

export const sendAdminContactEmail = async ({
  name,
  email,
  subject,
  message,
  contactId,
}) => {
  try {
    await brevoAPI.post("/smtp/email", {
      sender: {
        name: process.env.SENDER_NAME || "Autonex",
        email: process.env.SENDER_EMAIL,
      },

      to: [
        {
          email: process.env.ADMIN_EMAIL,
        },
      ],

      subject: `📩 New Contact Form - ${subject}`,

      htmlContent: `
        <h2>New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <hr>

        <p>${message}</p>

        <hr>

        <small>Contact ID: ${contactId}</small>
      `,
    });

  } catch (error) {
    console.error(
      "❌ Contact Email Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to send admin contact email.");
  }
};

export const sendUserContactConfirmation = async ({
  name,
  email,
}) => {
  try {
    await brevoAPI.post("/smtp/email", {
      sender: {
        name: process.env.SENDER_NAME || "Autonex",
        email: process.env.SENDER_EMAIL,
      },

      to: [
        {
          email,
        },
      ],

      subject: "We've received your enquiry",

      htmlContent: `
        <h2>Hello ${name},</h2>

        <p>Thank you for contacting <strong>AutoNex</strong>.</p>

        <p>We have received your enquiry.</p>

        <p>Our team will get back to you shortly.</p>

        <br>

        <p>
          Regards,<br>
          <strong>AutoNex Team</strong>
        </p>
      `,
    });

  } catch (error) {
    console.error(
      "❌ Confirmation Email Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to send confirmation email.");
  }
};