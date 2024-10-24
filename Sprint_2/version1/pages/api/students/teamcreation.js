import fs from 'fs';
import path from 'path';
import { useSession} from "next-auth/react";
import { useState, useEffect } from "react";
import { teamsByInstructor, updateTeamsArray, addTeam } from '../teams/teams.js';



export default async function handler(req, res) {
  //const { data: session} = useSession();
  /*const fetchUser = async () => {
    try {
        const username = session.user.name;

        // Make the fetch call
        const response = await fetch(`/api/users/userInfo/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }

        const data = await response.json(); // Parse the JSON response
        console.log(session.user.name);
    } catch (err) {
        
    }
};*/

//fetchUser(); // Call the async function
/*if(session){
  const response = await fetch(`/api/users/userInfo/`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username }),
});
  console.log(session.user.name);
}*/
  
  if (req.method === 'POST') {
    const { name, students, username } = req.body; // Extract teamName and teamMembers from the request body

    console.log(teamsByInstructor);

    // Define the path for the CSV file
    const csvFilePath = path.join(process.cwd(), 'data', 'teams.csv');

    try {
      // Check if the CSV file exists; if not, create it with headers
      if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(csvFilePath, 'team,instructor,students\n'); // Add Team Name as a header
      }

      // Append the new team data to the CSV file
      fs.appendFileSync(csvFilePath, `${name},${username},${students}\n`, 'utf8');
      console.log(`Team ${name} created with IDs: ${students} by user: ${username}`);
      addTeam(username, name, students); // Add the new team to the teamsByInstructor object
      // Send a success response
      res.status(200).json({ message: 'Team created and IDs written to CSV successfully!' });
    } catch (error) {
      console.error('Error writing to CSV:', error);
      res.status(500).json({ message: 'Failed to write team IDs to CSV' });
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}