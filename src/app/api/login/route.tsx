import axios from "axios";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { identifier, password } = data;

    if (!identifier || !password) {
      return new Response(
        JSON.stringify({ error: "Missing identifier or password" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const user = { identifier, password };
    console.log("user from ssr", user);

    const loginResponse = await axios.post("http://localhost:1337/api/auth/local", user);
    const jwt = loginResponse.data.jwt;
    console.log("jwt from ssr", jwt);

    const userProfileResponse = await axios.get(
      "http://localhost:1337/api/users/me?populate[role][fields]=type",
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    };

    const cookieHeader = `jwt=${jwt}; ${Object.entries(cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")}`;

    const userData = {
      ...userProfileResponse.data,
      token: jwt
    };

    return new Response(
      JSON.stringify({
        message: "Login successful",
        data: {
          jwt,
          user: userData
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader
        }
      }
    );
  } catch (error) {
    console.error("Error during login or fetching user profile:", error);

    let errorMessage = "Login failed";

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else {
        errorMessage = "No response from server";
      }
    } else {
      errorMessage = "An unknown error occurred";
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
