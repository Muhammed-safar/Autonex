import { useParams } from "react-router-dom";

const EmployeeOrderPage = () => {
    const { trackingId } = useParams();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold">
                    Employee Order Management
                </h1>

                <p className="mt-2 text-gray-500">
                    Tracking ID: {trackingId}
                </p>
            </div>
        </div>
    );
};

export default EmployeeOrderPage;