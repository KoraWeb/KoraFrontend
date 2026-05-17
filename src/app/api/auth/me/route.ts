import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type UserPayload = {
  sub: string;
  id: number;
  name: string;
  username: string;
  role: string;
  exp: number;
};

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ logged: false }, { status: 401 });
  }

  try {
    const decoded = jwtDecode<UserPayload>(token);

    if (decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ logged: false }, { status: 401 });
    }

    return NextResponse.json({
      logged: true,
      id: decoded.id,
      name: decoded.name,
      username: decoded.username,
      email: decoded.sub,
      role: decoded.role,
    });
  } catch {
    return NextResponse.json({ logged: false }, { status: 401 });
  }
}