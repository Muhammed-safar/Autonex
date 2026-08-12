import API from "./axios";

export const createPaymentOrder = async (data) => {
    const response = await API.post(
        "/payments/create-order",
        data
    );

    return response.data;
};

export const verifyPayment = async (data) => {
    const response = await API.post(
        "/payments/verify",
        data
    );

    return response.data;
};