// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authConfig } from '../../../../authConfig';

export async function GET(req: Request) {
  return NextAuth(authConfig)(req);
}

export async function POST(req: Request) {
  return NextAuth(authConfig)(req);
}
