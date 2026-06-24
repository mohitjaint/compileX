"use client";
import {  useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import * as authStore from '@/lib/authStore'
import { useRouter } from 'next/navigation'

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
    setAccessToken: (token: string | null) => void;

    user : User| null;
    setUser: React.Dispatch<
        React.SetStateAction<User | null>
    >;

    loading: boolean;

    rotateToken: () => Promise<string | null>;
    logout: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children } : AuthProviderProps) => {

    const [accessTokenRaw, setAccessTokenRaw] = useState<string | null>(null);
    const router = useRouter()

    const setAccessToken = (token: string | null) => {
        setAccessTokenRaw(token)
        authStore.setAccessToken(token)
    }
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const clearAuthState = () => {
        setAccessToken(null);
        setUser(null);
    };

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
            return response.data.accessToken ?? null;
        }
        catch(err: any) {
            if (err?.message === 'Unauthorized') {
                console.log('No active session / refresh token found.');
            } else {
                console.error('Error rotating token:', err);
            }
            clearAuthState();
            return null;
        }
        finally{
            setLoading(false);
        }
        
    }

    const logout = async () => {
        try {
            await apiFetch('/users/logout', { method: 'POST' })
        } catch (err) {
            console.error('Error logging out:', err);
        } finally {
            clearAuthState();
        }
    }

    useEffect(() => {
        // On component mount, try to rotate token to get a new access token
        rotateToken();
        // register rotate/clear hooks for non-react modules
        authStore.setRotateToken(rotateToken)
        authStore.setClearAuth(() => {
            clearAuthState()
            try {
                router.replace('/login')
            } catch (err) {
                // ignore
            }
        })
    }, []);

    return (
        <AuthContext.Provider
            value={{
                accessToken: accessTokenRaw,
                setAccessToken,
                user,
                setUser,
                rotateToken,
                logout,
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