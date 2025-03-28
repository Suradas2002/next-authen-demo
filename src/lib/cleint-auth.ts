import Cookies from 'js-cookie';

interface CookieOptions {
    expires?: number;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

export const setAuthCookies = (
    token: string,
    username: string,
    staySignedIn: boolean = false
) => {
    const cookieOptions: CookieOptions = {
        expires: staySignedIn ? 30 : 1,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    Cookies.set('token', token, cookieOptions);
    Cookies.set('username', username, cookieOptions);
};

export const clearAuthCookies = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('username', { path: '/' });
};

export const getAuthCookies = () => {
    return {
        token: Cookies.get('token'),
        username: Cookies.get('username')
    };
};