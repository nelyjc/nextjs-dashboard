import { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from '@/authConfig'; // make sure path is correct

// Wrap NextAuth for App Router
const handler = (req: NextRequest) => NextAuth(authConfig)(req);

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
