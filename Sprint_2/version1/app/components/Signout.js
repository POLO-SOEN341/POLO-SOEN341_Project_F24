'use client';

import { signOut, useSession } from "next-auth/react";

export default function SignOutButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={async () => {
          await signOut({ redirect: false }); // Prevent automatic redirect
          setTimeout(() => {
            // Ensure the session is fully cleared before reloading
            document.cookie = 'next-auth.session-token=; Max-Age=0; path=/;'; // Clear session token cookie
            window.location.reload(); // Reload the page to reflect sign-out
          }, 500); // Optional delay to allow session invalidation
        }}
        className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out"
      >
        Sign Out
      </button>
    );
  }

  return null;  // No sign-out button if not authenticated
}
