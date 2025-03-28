import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Logout successful' });
  // ล้าง cookie "token" โดยตั้งค่าให้หมดอายุ
  response.cookies.set('token', '', { httpOnly: true, path: '/', expires: new Date(0) });
  return response;
}