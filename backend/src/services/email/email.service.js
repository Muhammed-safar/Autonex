import { brevoAPI } from "./brevo.service.js";

export const sendEmail = async ({
    to,
    name,
    subject,
    html,
}) => {
    await brevoAPI.post("/smtp/email", {
        sender: {
            name: process.env.SENDER_NAME || "AutoNex",
            email: process.env.SENDER_EMAIL,
        },

        to: [
            {
                email: to,
                name,
            },
        ],

        subject,

        htmlContent: html,
    });
};