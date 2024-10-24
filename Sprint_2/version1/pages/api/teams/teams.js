import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

let teamsByInstructor = {};


async function updateTeamsArray() {
    return new Promise((resolve, reject) => {
        const filePath = path.join(process.cwd(), 'data', 'teams.csv');

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const instructor = row.instructor.trim();  // Trim whitespace from instructor
                const team = row.team.trim();  // Trim whitespace from team
                const students = row.students.split(':').map((member) => member.trim());  // Trim students and split by colon

                console.log(`Processing row: instructor = ${instructor}, team = ${team}, students = ${students}`);

                // Initialize the instructor's entry if not present
                if (!teamsByInstructor[instructor]) {
                    teamsByInstructor[instructor] = [];
                }

                // Check if the team already exists for the instructor to avoid duplicates
                const existingTeam = teamsByInstructor[instructor].find(t => t.team === team);
                if (existingTeam) {
                    console.log(`Duplicate team detected for instructor ${instructor}: ${team}`);
                } else {
                    // Add the new team if it doesn't already exist
                    teamsByInstructor[instructor].push({
                        team: team,
                        students: students,
                    });
                }
            })
            .on('end', () => {
                resolve(teamsByInstructor);
            })
            .on('error', (err) => {
                console.error('Error reading CSV file:', err);
                reject(err);
            });
    });
}

// Call updateTeamsArray and log the result
updateTeamsArray().then((result) => {
    console.log("teams:" , result);
}).catch((error) => {
    console.error('Error:', error);
});

function addTeam(instructor, team, students) {
    // Initialize the instructor's entry if not present
    if (!teamsByInstructor[instructor]) {
        teamsByInstructor[instructor] = [];
    }

    // Check if the team already exists for the instructor to avoid duplicates
    const existingTeam = teamsByInstructor[instructor].find(t => t.team === team);
    if (existingTeam) {
        console.log(`Duplicate team detected for instructor ${instructor}: ${team}`);
        return false;
    } else {
        // Add the new team if it doesn't already exist
        teamsByInstructor[instructor].push({
            team: team,
            students: students,
        });
        return true;
    }
}

export { teamsByInstructor, updateTeamsArray, addTeam };
