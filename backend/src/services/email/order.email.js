import { sendEmail } from "./email.service.js";
import { baseTemplate } from "./baseTemplate.js";

const orderTemplate = (order, message) => {
    return `
        <p>${message}</p>

        <h3>Order Details</h3>

        <p>
            <strong>Order Number:</strong>
            ${order.orderNumber}
        </p>

        <p>
            <strong>Status:</strong>
            ${order.orderStatus}
        </p>

        <p>
            <strong>Total Amount:</strong>
            ₹${order.totalAmount}
        </p>
    `;
};

export const sendOrderStatusEmail = async ({
    order,
    title,
    subject,
    message,
}) => {

    const html = baseTemplate({

        title,

        heading: `Hello ${order.shippingAddress.fullName}`,

        content: orderTemplate(order, message)

    });

    await sendEmail({

        to: order.user.email,

        name: order.shippingAddress.fullName,

        subject,

        html

    });

};