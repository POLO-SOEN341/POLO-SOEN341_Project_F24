import { FaChalkboardTeacher, FaUser } from 'react-icons/fa';
import { useState } from 'react';

export default function Team({ team, instructor }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <FaChalkboardTeacher className="mr-2 text-blue-500" />
          {team.team}
        </h1>
        <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-lg">
          Instructor: {instructor}
        </span>
      </div>

      {/* Students list */}
      <div
        className={`relative overflow-hidden transition-max-height duration-300 ease-in-out ${isHovered ? 'max-h-screen' : 'max-h-6'}`}
      >
        <div className={`text-gray-600 ${isHovered ? 'whitespace-normal' : 'whitespace-nowrap overflow-hidden text-ellipsis'}`}>
          {team.students.map((student) => (
            <p key={student} className={`inline-flex items-center mr-3 mb-2`}>
              <FaUser className="text-gray-500 mr-1" />
              <span className="text-sm">{student}</span>
            </p>
          ))}
        </div>
        {!isHovered && (
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"></div>
        )}
      </div>
    </div>
  );
}
