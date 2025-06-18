// src/components/auth/ProtectRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

function ProtectLogin({ children }) {
    // Get authState from localStorage
    const authState = JSON.parse(localStorage.getItem('authState'));
    
    if (authState) {
        return <Navigate to="/app/home" replace />;
    }

    return children ? children : <Outlet />;
}

export default ProtectLogin;