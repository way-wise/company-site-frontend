import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
    }

    // In a real app, you'd verify the token with your backend
    // For now, we'll just return a mock user
    const mockUser = {
      id: "1",
      email: "user@example.com",
      name: "Test User",
      contactNumber: "1234567890",
      gender: "MALE" as const,
      role: "CLIENT" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: mockUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Auth check failed" }, { status: 500 });
  }
}
