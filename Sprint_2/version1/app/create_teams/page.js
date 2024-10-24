'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

// StudentTable component
const StudentTable = ({ students, onStudentClick, selectedStudents }) => {
  
  return (
    <div className="overflow-y-auto max-h-[400px]">
      
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {students.map((student, index) => (
            <tr
              key={index}
              onClick={() => onStudentClick(student)}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">{student.id}</td>
              <td className={`py-3 px-6 text-left ${selectedStudents.some(s => s.id === student.id) ? 'text-red-500' : ''}`}>
                {student.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [students, setStudents] = useState([]);
  const [clickedStudents, setClickedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamName, setteamName] = useState('');
  const [statusMessage, setStatusMessage] = useState(null); // State to handle success/error messages
  const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter

  const fetchStudentsData = async () => {
    try {
      const response = await fetch('/api/students/students'); // Fetch from the API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const studentsData = await response.json(); // Parse the JSON response
      setStudents(studentsData); // Set the students state
    } catch (error) {
      setStatusMessage({ type: 'error', message: 'Error fetching students data' });
    }
  };

  useEffect(() => {
    fetchStudentsData(); // Fetch students data on component mount
  }, []);

  const userName = session ? session.user.name : "default";

  // Filter students based on the search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentClick = (student) => {
    // Limit the selected students to 6 and toggle their selection
    if (clickedStudents.some(s => s.id === student.id)) {
      setClickedStudents(clickedStudents.filter(s => s.id !== student.id)); // Remove if already clicked
    } else if (clickedStudents.length < 6) {
      setClickedStudents([...clickedStudents, student]); 
    }
  };

  const handleCreateTeam = async () => {
    try {
      let tempUsers = [];
      const teamData = clickedStudents.map(student => tempUsers.push(student.name));
      const usersStr = tempUsers.join(':');
      let team = { name: teamName, students: usersStr, username: userName };
  
      // Send the selected students' data to the backend using POST
      const response = await fetch('/api/students/teamcreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: teamName, students: usersStr, username: userName }), // Send team members in the body
      });
  
      if (!response.ok) {
        throw new Error('Failed to create team');
      }
  
      const result = await response.json(); // Get the response from the backend
      setStatusMessage({ type: 'success', message: 'Team created successfully!' }); // Show success message
  
      // Redirect to the dashboard and force a page reload after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard'; // Redirect and refresh the dashboard
      }, 2000);
  
    } catch (error) {
      setStatusMessage({ type: 'error', message: 'Failed to create the team.' });
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      
      <div className="flex space-x-8 w-full max-w-5xl">
        
        {/* Left Side: All Students */}
        <div className="w-1/2">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">All Students</h2>
          <input
            type="text"
            className="w-full mb-4 px-4 py-2 border rounded-lg shadow-md text-black"
            placeholder="Search Students here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            className="w-full mb-4 px-4 py-2 border rounded-lg shadow-md text-black"
            placeholder="Write Team Name..."
            value={teamName}
            onChange={(e) => setteamName(e.target.value)}
          />
          <StudentTable students={filteredStudents} onStudentClick={handleStudentClick} selectedStudents={clickedStudents} />
        </div>

        {/* Right Side: Clicked Students */}
        <div className="w-1/2">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Clicked Students</h2>
          
          {statusMessage && (
            <div className={`text-center mb-4 ${statusMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {statusMessage.message}
            </div>
          )}

          {(clickedStudents.length > 1 && teamName !== "") ? (
            <button
              onClick={handleCreateTeam}
              className="w-full mb-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
            >
              Create Team
            </button>
          ) : (
            <p className="text-center text-gray-600">
              {clickedStudents.length < 2 && teamName === "" ? 
                "Not enough students chosen and team name not written." :
                (clickedStudents.length < 2 ? "Not enough students chosen." : "Team name not written.")
              }
            </p>
          )}
          {clickedStudents.length > 0 ? (
            <StudentTable students={clickedStudents} onStudentClick={handleStudentClick} selectedStudents={clickedStudents} />
          ) : (
            <p className="text-center text-gray-600">No students clicked yet.</p>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default App;
