import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext<{
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/status`, { withCredentials: true });
                setIsLoggedIn(response.data.isAuthenticated);
            } catch (error) {
                console.error("Error checking auth status:", error);
                setIsLoggedIn(false);
            }
        };

        checkAuthStatus();
    }, []);

    return (
        <GoogleOAuthProvider clientId='516453322893-n7ppaq89tteacugri4ec8posi45bbt93.apps.googleusercontent.com'>
            <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};