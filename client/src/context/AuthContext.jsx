import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create axios instance
    const api = axios.create({
        withCredentials: true
    });

    // Check if user is logged in
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const { data } = await api.get('/api/auth/me');
                setUser(data.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    // Register User
    const register = async (userData) => {
        setError(null);
        try {
            const res = await api.post('/api/auth/register', userData);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    // Verify OTP
    const verifyOTP = async (email, otp) => {
        setError(null);
        try {
            const res = await api.post('/api/auth/verify-otp', { email, otp });
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
            throw err;
        }
    };

    // Login User
    const login = async (userData) => {
        setError(null);
        try {
            const res = await api.post('/api/auth/login', userData);
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    // Logout User
    const logout = async () => {
        try {
            await api.get('/api/auth/logout');
            setUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, verifyOTP, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
