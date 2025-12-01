import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or unauthorized page
    }

    // Check verification status for NGOs
    if (user.role === 'ngo' && user.verificationStatus !== 'approved') {
        // Allow access to waiting page
        if (location.pathname === '/ngo/waiting-for-approval') {
            return children;
        }
        return <Navigate to="/ngo/waiting-for-approval" replace />;
    }

    return children;
};

export default ProtectedRoute;
