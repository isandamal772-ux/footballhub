import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });
  
  // Clear cookie
  response.cookies.set('wfh_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
