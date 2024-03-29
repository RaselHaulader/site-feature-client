import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <span className="loading loading-infinity loading-lg"></span>
    }

    if (user?.role) {
        return children;
    } else if (user) {
        return <Navigate state={location.pathname} to="/not-approved"></Navigate>;
    }

    return <Navigate state={location.pathname} to="/login"></Navigate>;
};

export default PrivateRoute;