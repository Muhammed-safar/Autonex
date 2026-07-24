import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log("1. Creating transporter");

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("2. Transporter created");

    await transporter.verify();

    console.log("3. SMTP verified");

    await transporter.sendMail({
      from: `"Autonex" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Autonex Email Verification",
      html: `
        <h2>Your OTP is</h2>
        <h1>${otp}</h1>
      `,
    });

    console.log("4. Email sent");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
