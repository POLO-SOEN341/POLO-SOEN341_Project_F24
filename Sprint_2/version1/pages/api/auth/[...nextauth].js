import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { users, updateUsersArray } from '../users/users';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Log received credentials for debugging
        console.log('Authorize credentials:', credentials);

        // Ensure users array is up to date
        if (users.length === 0) {
          await updateUsersArray();
          console.log('Users array updated:', users); // Log users after update
        }
        console.log('Users array:', users); // Log users array for debugging
        const user = users.find(
          (user) =>
            user.username === credentials.username &&
            user.password === credentials.password
        );

        if (user) {
          console.log('User found:', user); // Log found user for debugging
          return { id: user.username, name: user.username };
        } else {
          console.log('Invalid credentials'); // Log invalid credentials
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Ensure we're using JWT-based sessions
    maxAge: 60 * 60, // Set JWT expiration time (1 hour)
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Ensure secret is set in .env
    maxAge: 60 * 60, // JWT lifetime (1 hour)
  },
  pages: {
    signIn: '/login', // Path to your custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Pass user ID in session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure the secret is set in the environment
  debug: true, // Enable debug logs to identify the issue more easily
});
