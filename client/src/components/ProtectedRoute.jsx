import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
    const { accessToken, setAuth } = useAuthStore();
    const [loading, setLoading] = useState(!accessToken);

    useEffect(() => {
        if (accessToken) return;

        // Try to restore session from refresh token cookie
        axios
            .post(
                `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                {},
                { withCredentials: true }
            )
            .then(({ data }) => {
                setAuth(data.user, data.accessToken);
            })
            .catch(() => {
                // No valid refresh token — user needs to log in
            })
            .finally(() => setLoading(false));
    }, [accessToken, setAuth]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading...</div>;
    }

    return accessToken ? children : <Navigate to="/login" replace />;
}