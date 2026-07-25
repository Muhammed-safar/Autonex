import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/account" replace />;
};

export default ProtectedRoute;
