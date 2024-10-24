import fs from 'fs';
import path from 'path';
import users from '../users/users';

export default async function handler(req, res) {
  console.log(users);
  if (req.method === 'POST') {
    const { username } = req.body;

    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'data', 'users.csv');
    
    try {
      // Check if the CSV file exists
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Split the CSV file into rows, ignoring empty lines
        const rows = data.split('\n').filter(row => row.trim() !== '');
        
        // Check if the username exists in any row (case-insensitive)
        const usernameTaken = rows.some(row => {
          const [existingUsername] = row.split(',').map(item => item.trim()); // Trim any extra spaces
          return existingUsername.toLowerCase() === username.toLowerCase();   // Case-insensitive comparison
        });
        
        if (usernameTaken) {
          return res.status(200).json({ available: false });
        } else {
          return res.status(200).json({ available: true });
        }
      } else {
        // If no users exist, all usernames are available
        return res.status(200).json({ available: true });
      }
    } catch (error) {
      console.error('Error reading CSV file:', error); // Log full error stack for debugging
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
