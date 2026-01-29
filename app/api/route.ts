import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config"; // adjust path if needed
import { z } from "zod";
import bcrypt from "bcrypt";
import postgres from "postgres";
import type { User } from "@/app/lib/definitions";

// Connect to your Postgres database
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Helper to fetch user by email
async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
    return result[0];
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return undefined;
  }
}

// Export NextAuth handler
const handler = NextAuth({
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

        return user; // returns user object to session
      },
    }),
  ],
  secret: process.env.AUTH_SECRET_KEY, // make sure this exists on Vercel
});

export { handler as GET, handler as POST };
