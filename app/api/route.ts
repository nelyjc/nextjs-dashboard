import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config"; // adjust if needed
import { z } from "zod";
import bcrypt from "bcrypt";
import postgres from "postgres";
import type { User } from "@/app/lib/definitions";
import type { NextRequest } from "next/server";

// Postgres connection
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Fetch user by email
async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
    return result[0];
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return undefined;
  }
}

// NextAuth handler for App Router
const authHandler = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return user;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET_KEY,
});

// Adapter for App Router: wrap in async function
export async function GET(request: NextRequest) {
  return authHandler(request);
}
export async function POST(request: NextRequest) {
  return authHandler(request);
}
