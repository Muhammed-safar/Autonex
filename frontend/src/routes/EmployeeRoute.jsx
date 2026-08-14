import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const EmployeeRoute = () => {
    const { isAuthenticated, user } = useSelector(
        (state) => state.auth
    );

    if (!isAuthenticated) {
        return <Navigate to="/account" replace />;
    }

    if (!["admin", "employee"].includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default EmployeeRoute;