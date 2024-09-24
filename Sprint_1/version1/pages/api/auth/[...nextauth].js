// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

let users = [];

// Function to update users array by reading and parsing CSV
async function updateUsersArray() {
  return new Promise((resolve, reject) => {
    const tempUsers = []; // Temporary array to store users during parsing

    // Define the path to the CSV file
    const filePath = path.join(process.cwd(), 'data', 'users.csv');

    // Read the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Push each row (user) into the tempUsers array
        tempUsers.push({
          username: row.username,
          password: row.password,
        });
      })
      .on('end', () => {
        // Update the global users array once parsing is complete
        users = tempUsers;
        resolve(users); // Resolve the promise with the updated users array
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err); // Reject the promise on error
      });
  });
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Ensure users array is up to date
        if (users.length === 0) {
          await updateUsersArray();
        }

        const user = users.find(
          (user) =>
            user.username === credentials.username &&
            user.password === credentials.password
        );

        if (user) {
          // Return user object (you can include other user properties if needed)
          return { id: user.username, name: user.username };
        } else {
          // Return null if user not found
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login', // Path to your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
});
