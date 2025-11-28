import { NextRequest, NextResponse } from "next/server";

const ALLOWED_USERS = [{ username: "user", password: "user_password" }];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  const user = ALLOWED_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    // Set a cookie for authentication
    response.cookies.set({
      name: "auth_token",
      value: "your_secret_token",
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 60 * 60 * 24,
    });

    return response;
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}
