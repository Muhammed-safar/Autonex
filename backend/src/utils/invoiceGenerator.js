import PDFDocument from "pdfkit";

export const generateInvoice = (order, res) => {
  const PAGE_WIDTH = 256; // ~80mm
  const MARGIN = 10;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  // --------------------------------------------------
  // HEIGHT
  // --------------------------------------------------

  const estimatedItemHeight = order.items.reduce((total, item) => {
    const nameLength = item.name?.length || 0;

    // More height for long product names
    const nameLines = Math.ceil(nameLength / 32);

    return total + 24 + nameLines * 8;
  }, 0);

  const calculatedHeight =
    275 +
    estimatedItemHeight +
    (order.shippingAddress.addressLine2 ? 8 : 0);

  const doc = new PDFDocument({
    size: [PAGE_WIDTH, calculatedHeight],
    margins: {
      top: MARGIN,
      bottom: MARGIN,
      left: MARGIN,
      right: MARGIN,
    },
  });

  // --------------------------------------------------
  // RESPONSE
  // --------------------------------------------------

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${order.orderNumber}.pdf`
  );

  doc.pipe(res);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const separator = () => {
    doc
      .moveTo(MARGIN, doc.y)
      .lineTo(PAGE_WIDTH - MARGIN, doc.y)
      .strokeColor("#555555")
      .lineWidth(0.5)
      .stroke();

    doc.moveDown(0.35);
  };

  const addMetaRow = (label, value) => {
    const y = doc.y;

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(`${label}:`, MARGIN, y, {
        width: 45,
      });

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(value, MARGIN + 45, y, {
        width: CONTENT_WIDTH - 45,
      });

    doc.moveDown(0.2);
  };

  const addTotalRow = (label, value, bold = false) => {
    const y = doc.y;

    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 9 : 8)
      .text(label, MARGIN, y, {
        width: CONTENT_WIDTH / 2,
      });

    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 9 : 8)
      .text(value, MARGIN, y, {
        width: CONTENT_WIDTH,
        align: "right",
      });

    doc.moveDown(0.3);
  };

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("AUTONEX", {
      align: "center",
      width: CONTENT_WIDTH,
    });

  doc.moveDown(0.15);

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("TAX INVOICE", {
      align: "center",
      width: CONTENT_WIDTH,
    });

  doc.moveDown(0.5);

  separator();

  // --------------------------------------------------
  // ORDER INFORMATION
  // --------------------------------------------------

  addMetaRow(
    "Date",
    new Date(order.createdAt || Date.now()).toLocaleDateString()
  );

  addMetaRow(
    "Order",
    `#${order.orderNumber}`
  );

  addMetaRow(
    "Status",
    order.orderStatus?.toUpperCase() || "PAID"
  );

  addMetaRow(
    "Pay Via",
    order.paymentMethod?.toUpperCase() || "RAZORPAY"
  );

  doc.moveDown(0.2);

  separator();

  // --------------------------------------------------
  // DELIVER TO
  // --------------------------------------------------

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("DELIVER TO:");

  doc.moveDown(0.15);

  const address = order.shippingAddress;

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(address.fullName);

  doc.text(address.phone);

  doc.text(address.addressLine1);

  if (address.addressLine2) {
    doc.text(address.addressLine2);
  }

  doc.text(
    `${address.city}, ${address.state} - ${address.postalCode}`
  );

  doc.moveDown(0.35);

  separator();

  // --------------------------------------------------
  // ITEMS HEADER
  // --------------------------------------------------

  const itemHeaderY = doc.y;

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("ITEM", MARGIN, itemHeaderY);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("PRICE", MARGIN, itemHeaderY, {
      width: CONTENT_WIDTH,
      align: "right",
    });

  doc.moveDown(0.25);

  separator();

  // --------------------------------------------------
  // ITEMS
  // --------------------------------------------------

  order.items.forEach((item) => {
    const itemStartY = doc.y;

    // Product name
    doc
      .font("Helvetica")
      .fontSize(8)
      .text(item.name, MARGIN, itemStartY, {
        width: CONTENT_WIDTH - 50,
        lineGap: 1,
      });

    // Price
    doc
      .font("Helvetica")
      .fontSize(8)
      .text(
        `RS.${item.subtotal}`,
        MARGIN,
        itemStartY,
        {
          width: CONTENT_WIDTH,
          align: "right",
        }
      );

    // Quantity × price
    doc
      .font("Helvetica")
      .fontSize(7)
      .text(
        `${item.quantity} x RS.${item.price}`,
        MARGIN,
        doc.y + 1
      );

    doc.moveDown(0.25);
  });

  separator();

  // --------------------------------------------------
  // TOTALS
  // --------------------------------------------------

  addTotalRow(
    "Subtotal",
    `RS.${order.subtotal}`
  );

  addTotalRow(
    "Shipping Charge",
    `RS.${order.shippingCharge || 0}`
  );

  addTotalRow(
    "Discount",
    `-RS.${order.discount || 0}`
  );

  doc.moveDown(0.1);

  separator();

  // --------------------------------------------------
  // FINAL TOTAL
  // --------------------------------------------------

  addTotalRow(
    "TOTAL AMOUNT",
    `RS.${order.totalAmount}`,
    true
  );

  doc.moveDown(0.5);

  separator();

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(
      "Thank you for shopping with Autonex!",
      {
        align: "center",
        width: CONTENT_WIDTH,
      }
    );

  doc.end();
};