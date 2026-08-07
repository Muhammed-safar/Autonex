import QRCode from "qrcode";

export const generateQRCode = async (trackingId) => {
    const trackingUrl = `${process.env.FRONTEND_URL}/e/o/${trackingId}`;

    const qrCode = await QRCode.toDataURL(trackingUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 300,
    });

    return qrCode;
};