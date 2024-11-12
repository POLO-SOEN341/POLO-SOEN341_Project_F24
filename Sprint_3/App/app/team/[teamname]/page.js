'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaUsers } from 'react-icons/fa';
import NavBar from '../../components/NavBar';
import { useSession } from 'next-auth/react';  // Import useSession

const TeamPage = () => {
    const router = useRouter();
    const [baseRatingsTable, setBaseRatingsTable] = useState([]);
    const [summaryTable, setSummaryTable] = useState([]);
    const { teamname: teamName } = useParams();
    const { data: session } = useSession();  // Get session data

    // Check if the user is an instructor
    const isInstructor = session?.user?.role === 'instructor';

    useEffect(() => {
        if (!teamName || !isInstructor) return;  // Only fetch ratings if the user is an instructor

        const fetchRatings = async () => {
            try {
                const response = await fetch('/api/teams/getTeamRatings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teamName }),
                });

                const result = await response.json();
                if (response.ok) {
                    console.log("Fetched ratings:", result.ratings);
                    setBaseRatingsTable(result.ratings);
                    createSummaryTable(result.ratings);
                } else {
                    console.error('Error fetching team ratings:', result.message);
                }
            } catch (error) {
                console.error('Error fetching team ratings:', error);
            }
        };

        fetchRatings();
    }, [teamName, isInstructor]);  // Depend on isInstructor

    const handleStudentClick = (studentId) => {
        router.push(`/team/${teamName}/${studentId}`);
    };

    const createSummaryTable = (ratings) => {
        const summaryData = {};

        ratings.forEach((rating) => {
            const { studentId, lastName, firstName, ratings } = rating;

            if (!summaryData[studentId]) {
                summaryData[studentId] = {
                    studentId,
                    lastName,
                    firstName,
                    cooperationTotal: 0,
                    conceptualTotal: 0,
                    practicalTotal: 0,
                    workEthicTotal: 0,
                    peersResponded: 0,
                };
            }

            summaryData[studentId].cooperationTotal += ratings.cooperation;
            summaryData[studentId].conceptualTotal += ratings.conceptual;
            summaryData[studentId].practicalTotal += ratings.practical;
            summaryData[studentId].workEthicTotal += ratings.workEthic;
            summaryData[studentId].peersResponded += 1;
        });

        const summaryArray = Object.values(summaryData).map((student) => ({
            studentId: student.studentId,
            lastName: student.lastName,
            firstName: student.firstName,
            cooperation: (student.cooperationTotal / student.peersResponded).toFixed(2),
            conceptual: (student.conceptualTotal / student.peersResponded).toFixed(2),
            practical: (student.practicalTotal / student.peersResponded).toFixed(2),
            workEthic: (student.workEthicTotal / student.peersResponded).toFixed(2),
            average: (
                (student.cooperationTotal + student.conceptualTotal + student.practicalTotal + student.workEthicTotal) / (4 * student.peersResponded)
            ).toFixed(2),
            peersResponded: student.peersResponded,
        }));

        setSummaryTable(summaryArray);
    };

    // Show a message if the user is not an instructor
    if (!isInstructor) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavBar />
                <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6 mb-10">
                        <p className="text-gray-600 text-center">You do not have permission to view the ratings.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6 mb-10">
                    <div className="flex items-center mb-6">
                        <FaUsers className="text-blue-400 mr-4" size={28} />
                        <h1 className="text-3xl font-bold text-gray-800">Team Rating Summary: {teamName}</h1>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Student ID</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Last Name</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">First Name</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Cooperation</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Conceptual Contribution</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Practical Contribution</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Work Ethic</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Average</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Peers Who Responded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryTable.length > 0 ? (
                                    summaryTable.map((student, index) => {
                                        const rowColor = index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
                                        return (
                                            <tr
                                                key={student.studentId}
                                                className={`${rowColor} hover:bg-blue-100 transition duration-150 cursor-pointer`}
                                                onClick={() => handleStudentClick(student.studentId)}
                                            >
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.studentId}</td>
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.lastName}</td>
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.firstName}</td>
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.cooperation}</td>
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.conceptual}</td>
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.practical}</td>
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.workEthic}</td>
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.average}</td>
                                                <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.peersResponded}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="py-4 px-6 text-center text-gray-600">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Instruct to click student for detailed view */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="text-gray-600 text-center">Click a Student to see their Detailed Ratings!</p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default TeamPage;
