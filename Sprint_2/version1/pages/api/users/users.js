import fs from 'fs'; // File system module
import path from 'path'; // Path module
import csv from 'csv-parser'; // CSV parser module

let users = [];

// Function to update users array by reading and parsing CSV
async function updateUsersArray() {
  return new Promise((resolve, reject) => {
    const tempUsers = []; // Temporary array to store users during parsing

    // Define the path to the CSV file
    const filePath = path.join(process.cwd(), 'data', 'users.csv');
    

    // Read the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Push each row (user) into the tempUsers array
        tempUsers.push({
          username: row.username,
          password: row.password,
          id: row.id,
          name: row.name,
          role: row.role,
         
        });
      })
      .on('end', () => {
        // Update the global users array once parsing is complete
        users = tempUsers;
        resolve(users); // Resolve the promise with the updated users array
        
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err); // Reject the promise on error
      });
  });
}
if (users.length === 0) {
  await updateUsersArray();
}
// Call the function to update the users array
export {users, updateUsersArray}; // Export the users array
export default {users}; 