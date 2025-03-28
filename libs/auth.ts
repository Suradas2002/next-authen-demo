import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export const setAuthCookie = async (token: string) => {
    try {
        const decoded = jwtDecode(token) as DecodedToken;
        const expirationDate = new Date(decoded.exp * 1000);

        Cookies.set("jwt", token, {
            expires: expirationDate,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return true;
    } catch (error) {
        console.error("Error setting auth cookie:", error);
        return false;
    }
};

export const getAuthToken = () => {
    return Cookies.get("jwt");
};

export const removeAuthCookie = () => {
    Cookies.remove("jwt", { path: "/" });
};

export const isValidToken = (token: string) => {
    try {
        const decoded = jwtDecode(token) as DecodedToken;
        const currentTime = Date.now() / 1000;

        return decoded.exp > currentTime;
    } catch {
        return false;
    }
};