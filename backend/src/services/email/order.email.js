import { sendEmail } from "./email.service.js";
import { baseTemplate } from "./baseTemplate.js";


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