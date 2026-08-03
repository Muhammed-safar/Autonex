import transporter from "../config/nodemailer.js";

export const sendAdminContactEmail = async ({
  name,
  email,
  subject,
  message,
  contactId,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,

    subject: `📩 New Contact Form - ${subject}`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6">

        <h2>New Contact Form Submission</h2>

        <table cellpadding="8" cellspacing="0">

          <tr>
            <td><strong>Name</strong></td>
            <td>${name}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><strong>Subject</strong></td>
            <td>${subject}</td>
          </tr>

        </table>

        <hr>

        <h3>Message</h3>

        <p>${message}</p>

        <hr>

        <small>Contact ID : ${contactId}</small>

      </div>
    `,
  });
};

export const sendUserContactConfirmation = async ({
  name,
  email,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,

    subject: "We've received your enquiry",

    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6">

        <h2>Hello ${name},</h2>

        <p>
          Thank you for contacting <strong>AutoNex</strong>.
        </p>

        <p>
          We have successfully received your enquiry.
        </p>

        <p>
          Our support team will get back to you as soon as possible.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>AutoNex Team</strong>
        </p>

      </div>
    `,
  });
};