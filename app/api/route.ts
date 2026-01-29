// app/api/route.ts
import { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '../../authConfig';

const handler = (req: NextRequest) => NextAuth(authConfig)(req);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
