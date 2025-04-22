"use client";
import { AuthContext } from "@/hooks/useAuth";
import { AuthContextType, User } from "@/types/auth";
import React, { useEffect, useState, useCallback } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [authState, setAuthState] = useState<AuthContextType>(() => ({
    user: undefined,
    status: "loading",
    token: null,
    updateAuthStatus: () => { },
    isLoading: true
  }));

  const updateAuthStatus = useCallback(
    async (
      newStatus: "loading" | "authorized" | "unauthorized",
      userData?: User,
      token?: string | null
    ) => {
      console.log(userData);
      
      if (newStatus === "unauthorized") {
        setAuthState(prevState => ({
          ...prevState,
          user: undefined,
          status: "unauthorized",
          token: null,
          isLoading: false
        }));
        return;
      }

      if (newStatus === "loading") {
        setAuthState(prevState => ({
          ...prevState,
          status: "loading",
          isLoading: true
        }));
        return;
      }

      if (newStatus === "authorized" && userData && token) {
        const userWithRole = {
          ...userData,
          role: userData.role || {
            id: 2,
            type: "authenticated",
            name: "Authenticated",
            description: "Default role for authenticated users"
          }
        };
        console.log(userWithRole);
        
        setAuthState(prevState => ({
          ...prevState,
          user: userWithRole,
          status: "authorized",
          token: token,
          isLoading: false
        }));
      }
    },
    []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
          cache: 'no-store'
        });
        console.log(response);
        
        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
         
          console.log(data.user);

          if (data.user) {
            updateAuthStatus("authorized", data.user, data.token);
           
            
          } else {
            console.log('No user data in response');
            updateAuthStatus("unauthorized");
          }
        } else {
          console.log('Response not OK:', response.status);
          updateAuthStatus("unauthorized");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        if (mounted) {
          updateAuthStatus("unauthorized");
        }
      }
    };

    if (isClient) {
      fetchSession();
    }

    return () => {
      mounted = false;
    };
  }, [updateAuthStatus, isClient]);

  if (!isClient) {
    return (
      <AuthContext.Provider
        value={{
          user: undefined,
          status: "loading",
          token: null,
          updateAuthStatus,
          isLoading: true
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        updateAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}