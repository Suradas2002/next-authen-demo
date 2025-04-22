import axios from "axios";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    const data = await request.json();
    const { email, password, firstname, lastname } = data

    if (!email || !password || !firstname || !lastname) {
        return NextResponse.json(
            { message: "Missing required fields" },
            { status: 400 }
        );
    }
    console.log(data);
    
    
    

    try {
        const createUser = await axios.post(`${process.env.STRAPI_BACKEND_API_URL}/api/auth/local/register`,{
            username:email.split('@')[0],
            email,
            password
          })
          if (!createUser.data) {
            return NextResponse.json(
                { error: "เกิดข้อผิดพลาดในการลงทะเบียน" },
                { status: 500 }
            );
        }
          
        
        
        const createUserdataID = createUser.data.user.id;
        const jwt = createUser.data.jwt
        console.log("UserID",createUserdataID);
        

        const updateResponse = await axios.put(`${process.env.STRAPI_BACKEND_API_URL}/api/users/${createUserdataID}`,
            {
            firstname,
            lastname   
            },{
                headers: { Authorization: `Bearer ${jwt}` }, // ✅ ใช้ JWT ในการอัปเดตข้อมูล
            }

    )

        if (!updateResponse.data) {
            return NextResponse.json(
                { error: "เกิดข้อผิดพลาดในการอัพเดตข้อมูลผู้ใช้" },
                { status: 500 }
            );
            
        }

        return NextResponse.json(
            {
                message: "สมัครสมาชิกสำเร็จ",
                jwt: jwt,
                user: {
                    id: createUser.data.user.id, 
                    email: createUser.data.user.email,
                    firstname: updateResponse.data.firstname,
                    lastname: updateResponse.data.lastname
                }
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Error in register route:", error);

        return NextResponse.json(
            {
                error: error.response?.data?.message || "เกิดข้อผิดพลาด",
            },
            { status: error.response?.status || 500 }
        );
    }
    
}