"use client";
import {  useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import { set } from "date-fns";

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

    loading: boolean;

    rotateToken: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children } : AuthProviderProps) => {

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const rotateToken = async()  => {
        try{
            // fetch new access token using refresh token
            setLoading(true);
            //await new Promise(resolve => setTimeout(resolve, 3000));
            const response = await apiFetch('/users/rotate-tokens', {
                method: 'POST',
                credentials: 'include',
            })

            console.log('Token rotation response:', response);
            
            setAccessToken(response.data.accessToken);
            setUser(response.data.user);
        }
        catch(err) {
            console.error('Error rotating token:', err);
            setAccessToken(null);
            setUser(null);
        }
        finally{
            setLoading(false);
        }
        
    }

    useEffect(() => {
        // On component mount, try to rotate token to get a new access token
        rotateToken();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                setAccessToken,
                user,
                setUser,
                rotateToken,
                loading,
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