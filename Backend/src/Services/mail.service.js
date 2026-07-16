import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Autonex" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Autonex Email Verification",
      html: `
        <h2>Your OTP is</h2>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    console.log("OTP Email Sent");

  } catch (error) {
    console.error(error);
    throw new Error("Failed to send OTP email");
  }
};