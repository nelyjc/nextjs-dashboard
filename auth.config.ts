import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
    secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUser(credentials.email);
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (valid) return user;

        return null;
      },
    }),

  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;