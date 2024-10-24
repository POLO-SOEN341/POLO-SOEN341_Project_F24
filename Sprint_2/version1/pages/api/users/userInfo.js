import { users, updateUsersArray } from './users';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username } = req.body;
        let user = users.find((user) => user.username === username);
        user = { id: user.id, name: user.name, role: user.role, username: user.username };
        
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
}