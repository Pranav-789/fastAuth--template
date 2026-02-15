import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { userAPI, authAPI } from '../lib/api';

interface User {
    id: number;
    email: string;
    name: string | null;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: Parameters<typeof authAPI.login>[0]) => Promise<void>;
    register: (data: Parameters<typeof authAPI.register>[0]) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    reqVerifyEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        try {
            const response = await userAPI.getMe();
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (data: Parameters<typeof authAPI.login>[0]) => {
        await authAPI.login(data);
        await checkAuth();
    };

    const register = async (data: Parameters<typeof authAPI.register>[0]) => {
        await authAPI.register(data);
        await checkAuth();
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const reqVerifyEmail = async (email: string) => {
        await authAPI.reqVerifyEmail(email);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                register,
                logout,
                checkAuth,
                reqVerifyEmail,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
