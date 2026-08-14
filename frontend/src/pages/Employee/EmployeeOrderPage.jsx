import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios.js"; // adjust path if your API file is elsewhere

const EmployeeOrderPage = () => {
    const { trackingId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await API.get(
                    `/orders/tracking/${trackingId}`
                );

                setOrder(response.data.data);
            } catch (error) {
                console.error("Fetch employee order error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load order"
                );
            } finally {
                setLoading(false);
            }
        };

        if (trackingId) {
            fetchOrder();
        }
    }, [trackingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading order...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600">
                        Unable to load order
                    </h2>

                    <p className="mt-2 text-gray-500">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold">
                    Employee Order Management
                </h1>

                <div className="mt-6 border rounded-lg p-6">
                    <p>
                        <strong>Order Number:</strong>{" "}
                        {order.orderNumber}
                    </p>

                    <p className="mt-2">
                        <strong>Tracking ID:</strong>{" "}
                        {order.trackingId}
                    </p>

                    <p className="mt-2">
                        <strong>Status:</strong>{" "}
                        {order.orderStatus}
                    </p>

                    <p className="mt-2">
                        <strong>Total:</strong>{" "}
                        ₹{order.totalAmount}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeOrderPage;