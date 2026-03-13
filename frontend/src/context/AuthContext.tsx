import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    token: string | null;
    role: string | null;
    tenantSlug: string | null;
    tenantName: string | null;
    login: (token: string, role: string, tenantSlug: string, tenantName?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Sênior: Tratamento rigoroso para valores vindos do localStorage
    const getStoredValue = (key: string) => {
        const val = localStorage.getItem(key);
        return (val === 'null' || val === 'undefined') ? null : val;
    };

    const [token, setToken] = useState<string | null>(getStoredValue('token'));
    const [role, setRole] = useState<string | null>(getStoredValue('role'));
    const [tenantSlug, setTenantSlug] = useState<string | null>(getStoredValue('tenantSlug'));
    const [tenantName, setTenantName] = useState<string | null>(getStoredValue('tenantName'));

    const login = (newToken: string, newRole: string, newTenantSlug: string, newTenantName?: string) => {
        if (!newToken || !newRole || !newTenantSlug) return;
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);
        localStorage.setItem('tenantSlug', newTenantSlug);
        if (newTenantName) {
            localStorage.setItem('tenantName', newTenantName);
        }
        setToken(newToken);
        setRole(newRole);
        setTenantSlug(newTenantSlug);
        setTenantName(newTenantName || newTenantSlug);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('tenantSlug');
        localStorage.removeItem('tenantName');
        setToken(null);
        setRole(null);
        setTenantSlug(null);
        setTenantName(null);
    };

    const isAuthenticated = !!token && token !== '';

    return (
        <AuthContext.Provider value={{ token, role, tenantSlug, tenantName, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
