'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from 'next/link';
import Signout from '../components/Signout';
import TeamBox from '../components/TeamBox';
import { FaIdBadge, FaUserTie } from 'react-icons/fa';

export default function UserProfile() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        try {
          const username = session.user.name;

          const response = await fetch(`/api/users/userInfo/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          });

          if (!response.ok) throw new Error("Failed to fetch user info");

          const data = await response.json();
          setUser(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [session]);

  if (!session) {
    return <p className="text-red-500 text-center mt-8">You are not signed in.</p>;
  }

  if (loading) {
    return <p className="text-blue-500 text-center mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/">
                <div className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
                Peer Assessment System
                </div>
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user.name}</span>
                <Signout />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-10">
            <div className="md:flex md:items-center md:justify-between">
              {/* Left: Welcome Text and User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
                <div className="mt-4 text-gray-600">
                  <div className="flex items-center mb-2">
                    <FaIdBadge className="text-gray-500 mr-2" />
                    <span className="font-medium"></span> {user.id}
                  </div>
                  <div className="flex items-center">
                    <FaUserTie className="text-gray-500 mr-2" />
                    <span className="font-medium"></span> {user.role}
                  </div>
                </div>
              </div>

              {/* Right: Create Team Button */}
              {user.role === "Instructor" && (
                <div className="mt-6 md:mt-0">
                  <Link href="/create_teams">
                    <div className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                      Create Team
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Teams Section */}
          <div className="space-y-10">
            {/* Instructor's Teams */}
            {user.role === "Instructor" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4"></h2>
                <TeamBox instructor={user.username} />
              </div>
            )}

            {/* All Teams */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4"></h2>
              <TeamBox />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <p className="text-red-500 text-center mt-8">No user data found.</p>;
}
