"use client";

import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";

type User = {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
};

type AuthContextType = {
    accessToken: string | null;
    setAccessToken: React.Dispatch<
        React.SetStateAction<string | null>
    >;

    user : User| null;
    setUser: React.Dispatch<
        React.SetStateAction<User | null>
    >;
};

const AuthContext =
    createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children } : AuthProviderProps) => {

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                setAccessToken,
                user,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }

    return context;
};