import axios from "axios";
import { headers } from "next/headers";

interface Messages {
  missingCredentials: string;
  apiUrlNotConfigured: string;
  loginSuccess: string;
  loginFailed: string;
  noServerResponse: string;
  unknownError: string;
}

type SupportedLanguages = 'en' | 'th';

const messages: Record<SupportedLanguages, Messages> = {
  en: {
    missingCredentials: "Missing identifier or password",
    apiUrlNotConfigured: "API_URL is not configured",
    loginSuccess: "User login successfully",
    loginFailed: "Login failed",
    noServerResponse: "No response from server",
    unknownError: "An unknown error occurred"
  },
  th: {
    missingCredentials: "ไม่พบอีเมลหรือรหัสผ่าน",
    apiUrlNotConfigured: "ไม่ได้กำหนดค่า API_URL",
    loginSuccess: "เข้าสู่ระบบสำเร็จ",
    loginFailed: "เข้าสู่ระบบไม่สำเร็จ",
    noServerResponse: "ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์",
    unknownError: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
  }
};

function getMessagesForLang(lang: string): Messages {
  return messages[lang as SupportedLanguages] || messages.en;
}

export async function POST(request: Request) {
  try {
    // Get language from request headers
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language") || "en";
    // Simple language detection
    const lang = acceptLanguage.includes("th") ? "th" : "en";
    const msg = getMessagesForLang(lang);

    const data = await request.json();
    const { identifier, password } = data;

    if (!identifier || !password) {
      return new Response(
        JSON.stringify({ error: msg.missingCredentials }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Content-Language": lang
          }
        }
      );
    }

    const user = { identifier, password };
    console.log('user from ssr',user);
    

    const loginResponse = await axios.post('http://localhost:1337/api/auth/local', user);

    // Get user profile with role after successful login
    const jwt = loginResponse.data.jwt;
    console.log('jwt from ssr',jwt);
    
    const userProfileResponse = await axios.get(
      'http://localhost:1337/api/users/me?populate[role][fields]=type',
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const cookieOptions = {
      httpOnly: true, // prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
      sameSite: 'lax', // prevents cross-site request forgery (CSRF)
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/' // available across the entire site
    };

    const cookieHeader = `jwt=${jwt}; ${Object.entries(cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`;
    
    
    
    const userData = {
      ...userProfileResponse.data,
      token: jwt
    };
   
    // Send response back to client
    return new Response(
      JSON.stringify({
        message: msg.loginSuccess,
        data: {
          jwt,
          user: userData
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
          "Set-Cookie": cookieHeader
        },
      }
    );
  } catch (error) {
    console.error("Error during login or fetching user profile:", error);

    // Get language from request headers again (in case of error)
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language") || "en";
    const lang = acceptLanguage.includes("th") ? "th" : "en";
    const msg = getMessagesForLang(lang);

    // Define error message mapping type
    type ErrorMapping = {
      [key: string]: {
        [key in SupportedLanguages]: string;
      };
    };

    // Map common Strapi error messages to our translated messages
    const errorMap: ErrorMapping = {
      "Invalid identifier or password": {
        en: "Invalid email or password",
        th: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
      },
      "Email or Username are invalid": {
        en: "Invalid email format",
        th: "รูปแบบอีเมลไม่ถูกต้อง"
      }
    };

    // Determine appropriate error message
    let errorMessage = msg.loginFailed;
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error?.message) {
        const serverError = error.response.data.error.message;
        // Check if we have a translation for this error
        const mappedError = errorMap[serverError];
        if (mappedError) {
          errorMessage = mappedError[lang as SupportedLanguages];
        } else {
          errorMessage = serverError;
        }
      } else {
        errorMessage = msg.noServerResponse;
      }
    } else {
      errorMessage = msg.unknownError;
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang
        }
      }
    );
  }
}