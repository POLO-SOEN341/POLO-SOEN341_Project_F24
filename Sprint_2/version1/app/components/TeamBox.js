import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Team from './Team';

export default function TeamBox({ instructor }) {
  const { data: session } = useSession();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log(instructor);  
        const url = instructor 
          ? `/api/teams/teamsInfo?instructor=${instructor}`
          : '/api/teams/teamsInfo';
        console.log(url);
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch team data');

        const data = await response.json();
        console.log(data);
        // If data is an object (i.e., when fetching all teams), flatten it into an array
        if (!Array.isArray(data)) {
          const allTeams = Object.values(data).flat();
          setTeams(allTeams);
        } else {
          setTeams(data);  // If it's already an array (e.g., for specific instructor)
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, [instructor]);

  if (loading) {
    return <p className="text-blue-500 text-center mt-8">Loading teams...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        {instructor ? "My Teams" : "All Teams"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {teams.map((team, index) => (
          <Team key={index} team={team} instructor={instructor || team.instructor} />
        ))}
      </div>
    </div>
  );
}
