import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

const statusTransitions = {
  PLACED: ["CONFIRMED"],
  CONFIRMED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  RETURN_REQUESTED: [],
  RETURNED: [],
};

const EmployeeOrderPage = () => {
  const { trackingId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/orders/tracking/${trackingId}`);

        setOrder(response.data.data);
      } catch (error) {
        console.error("Fetch order error:", error);

        setError(error.response?.data?.message || "Failed to load order");
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
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">
            Unable to load order
          </h2>

          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>

          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              Order:{" "}
              <strong className="text-gray-800">{order.orderNumber}</strong>
            </span>

            <span>
              Tracking:{" "}
              <strong className="text-gray-800">{order.trackingId}</strong>
            </span>
          </div>
        </div>

        {/* Current Status */}
        {/* Current Status & Update */}
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-gray-500">Current Status</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {order.orderStatus}
          </p>

          {statusTransitions[order.orderStatus]?.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Status
              </label>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-80 border rounded-lg px-4 py-3 outline-none"
              >
                <option value="">Select next status</option>

                {statusTransitions[order.orderStatus].map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={!selectedStatus}
                className="mt-4 px-5 py-3 rounded-lg bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          )}
        </div>

        {/* Customer + Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold">Customer</h2>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                {order.user?.fullName ||
                  order.shippingAddress?.fullName ||
                  "N/A"}
              </p>

              <p>
                <span className="text-gray-500">Email:</span>{" "}
                {order.user?.email || "N/A"}
              </p>

              <p>
                <span className="text-gray-500">Phone:</span>{" "}
                {order.shippingAddress?.phone || "N/A"}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold">Payment</h2>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Method:</span>{" "}
                {order.paymentMethod}
              </p>

              <p>
                <span className="text-gray-500">Status:</span>{" "}
                {order.paymentStatus}
              </p>

              <p>
                <span className="text-gray-500">Total:</span> ₹
                {order.totalAmount}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Order Items</h2>

          <div className="mt-4 space-y-4">
            {order.items?.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 border-b pb-4 last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">₹{item.subtotal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Shipping Address</h2>

          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">
              {order.shippingAddress?.fullName}
            </p>

            <p>{order.shippingAddress?.addressLine1}</p>

            {order.shippingAddress?.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}

            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
            </p>

            <p>
              {order.shippingAddress?.postalCode},{" "}
              {order.shippingAddress?.country}
            </p>

            {order.shippingAddress?.landmark && (
              <p>Landmark: {order.shippingAddress.landmark}</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="mt-4 max-w-sm ml-auto space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>

              <span>₹{order.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>

              <span>₹{order.shippingCharge}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>

              <span>- ₹{order.discount}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-base">
              <span>Total</span>

              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Status History */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Status History</h2>

          <div className="mt-5 space-y-5">
            {order.statusHistory?.length > 0 ? (
              order.statusHistory
                .slice()
                .reverse()
                .map((history, index) => (
                  <div key={history._id || index} className="flex gap-4">
                    <div className="mt-1 w-3 h-3 rounded-full bg-blue-500 shrink-0" />

                    <div>
                      <p className="font-medium">{history.status}</p>

                      <p className="text-sm text-gray-500">
                        Updated by: {history.role}
                      </p>

                      {history.note && (
                        <p className="text-sm text-gray-600 mt-1">
                          {history.note}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(history.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500">
                No status history available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOrderPage;
