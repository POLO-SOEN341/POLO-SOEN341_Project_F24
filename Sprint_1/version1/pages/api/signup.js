import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { username, password, role, id, name } = req.body;
  
  
      const csvLine = `${username},${password},${role},${id},${name}\n`; // csv line text
  
     
      const filePath = path.join(process.cwd(), 'data', 'users.csv'); // path for csv file
  
      try {
        
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
     
        fs.appendFileSync(filePath, csvLine); // appends the info to the csv file
  
        // Respond with a success message
        res.status(200).json({ message: 'User signed up successfully!' }); // if the request is successful
      } catch (error) {
        console.error('Error writing to CSV file:', error);
        res.status(500).json({ message: 'Internal Server Error' });  // if the request is unsuccessful
      }
    } else {
      
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }