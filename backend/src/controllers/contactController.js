import Contact from "../models/Contact.js";

import {
  sendAdminContactEmail,
  sendUserContactConfirmation,
} from "../Services/mail.service.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    await sendAdminContactEmail({
      name,
      email,
      subject,
      message,
      contactId: contact._id,
    });

    await sendUserContactConfirmation({
      name,
      email,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Unable to send message",
    });
  }
};
