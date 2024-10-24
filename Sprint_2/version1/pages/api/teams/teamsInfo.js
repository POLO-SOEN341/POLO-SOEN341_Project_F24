import { teamsByInstructor, updateTeamsArray } from './teams.js';

export default async (req, res) => {
    if (Object.keys(teamsByInstructor).length === 0) {
        await updateTeamsArray();
    }

    if (req.method === 'GET') {
        if (req.query.instructor) {
            const instructor = req.query.instructor;
            if (teamsByInstructor[instructor]) {
                // Add instructor name to each team
                const teamsWithInstructor = teamsByInstructor[instructor].map(team => ({
                    ...team,
                    instructor: instructor, // Include instructor in each team
                }));
                res.status(200).json(teamsWithInstructor);
            } else {
                res.status(404).end(`Instructor ${instructor} not found`);
            }
        } else {
            // If no instructor is specified, return all teams with their respective instructor names
            const allTeams = Object.entries(teamsByInstructor).flatMap(([instructor, teams]) =>
                teams.map(team => ({
                    ...team,
                    instructor: instructor, // Include instructor in each team
                }))
            );
            res.status(200).json(allTeams);
        }
    }
};
