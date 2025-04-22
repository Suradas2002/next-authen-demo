"use client"
import { AuthContextType } from "@/types/auth";
import { createContext, useContext } from "react";

const defaultUpdateAuthStatus = () => {
  console.log('updateAuthStatus was called before it was initialized');
};

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  status: "loading",
  token: null,
  updateAuthStatus: defaultUpdateAuthStatus
});


export const useAuthContext = () => useContext(AuthContext);