import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Peer Assessment System</h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to the Peer Assessment System for university team projects. Our platform allows students to evaluate the contributions and performance of their teammates across four critical dimensions: cooperation, conceptual contribution, practical contribution, and work ethic.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          This system promotes accountability and provides valuable feedback to both students and instructors on team dynamics and individual efforts, ensuring a fair and transparent evaluation process.
        </p>

        <div className="space-y-4">
          <Link href="/login" className="block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
            Login
          </Link>
          <Link href="/signup" className="block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
            Signup
          </Link>
          
        </div>
      </div>
    </div>
  );
}