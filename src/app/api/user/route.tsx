import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

interface UserResponse {
    id: number;
    username: string;
    email: string;
    role?: {
        id: number;
        type: string;
        name: string;
        description: string;
    };
}

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        console.log('No token found in cookie');
        return NextResponse.json({ status: "unauthorized" }, { status: 401 });
    }

    try {
        const response = await axios.get<UserResponse>(
            'http://localhost:1337/api/users/me?populate=role',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // ถ้าไม่มี role ให้กำหนด default role เป็น authenticated
        const userData = {
            ...response.data,
            role: response.data.role || {
                id: 2,
                type: "authenticated",
                name: "Authenticated",
                description: "Default role for authenticated users"
            }
        };

        return NextResponse.json({
            status: "authorized",
            token: token,
            user: userData
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Authorization error:', error.response?.data);
        }

        return NextResponse.json({ status: "unauthorized" }, { status: 401 });
    }
}