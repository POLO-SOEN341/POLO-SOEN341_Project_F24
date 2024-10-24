// app/dashboard/layout.js
"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) router.push('/login'); // Redirect to login if not authenticated
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}