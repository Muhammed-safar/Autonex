import PDFDocument from "pdfkit";

export const generateInvoice = (order, res) => {
    const doc = new PDFDocument({
        margin: 50,
        size: "A4",
    });

    // Response Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `inline; filename=invoice-${order.orderNumber}.pdf`
    );

    doc.pipe(res);

    // Company

    doc
        .fontSize(24)
        .text("Your Company Name", {
            align: "center",
        });

    doc
        .fontSize(12)
        .text("Invoice", {
            align: "center",
        });

    doc.moveDown();

    // Invoice Details
    doc.fontSize(12);

    doc.text(`Invoice Date : ${new Date().toLocaleDateString()}`);
    doc.text(`Order Number : ${order.orderNumber}`);
    doc.text(`Order Status : ${order.orderStatus}`);
    doc.text(`Payment Method : ${order.paymentMethod}`);
    doc.text(`Payment Status : ${order.paymentStatus}`);

    doc.moveDown();

    // Customer
    doc
        .fontSize(14)
        .text("Shipping Address");

    doc.fontSize(12);

    doc.text(order.shippingAddress.fullName);
    doc.text(order.shippingAddress.phone);
    doc.text(order.shippingAddress.addressLine1);

    if (order.shippingAddress.addressLine2) {
        doc.text(order.shippingAddress.addressLine2);
    }

    doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state}`
    );

    doc.text(
        `${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
    );

    doc.moveDown();

    // Items
    doc
        .fontSize(14)
        .text("Products");

    doc.moveDown(0.5);

    order.items.forEach((item) => {
        doc.fontSize(12);

        doc.text(item.name);

        doc.text(
            `Qty : ${item.quantity}    Price : ₹${item.price}    Subtotal : ₹${item.subtotal}`
        );

        doc.moveDown(0.5);
    });

    doc.moveDown();

    // Totals
    doc.fontSize(12);

    doc.text(`Subtotal : ₹${order.subtotal}`);

    doc.text(`Shipping : ₹${order.shippingCharge}`);

    doc.text(`Discount : ₹${order.discount}`);

    doc.moveDown(0.5);

    doc
        .font("Helvetica-Bold")
        .text(`Total : ₹${order.totalAmount}`);

    doc.font("Helvetica");

    doc.moveDown(2);

    // Footer
    doc
        .fontSize(10)
        .text(
            "Thank you for shopping with us!",
            {
                align: "center",
            }
        );

    doc.end();
};