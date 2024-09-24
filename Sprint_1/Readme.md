The problem is to implement 3 core feature of User Authentification and Team management.

The three core feature are : Implement Student and Instructor login system (with roles). Functionality for instructors to create teams and assign students to specific groups. (For example, importing a course roaster from a CSV file). Ensure teams are visible to both students and instructors.

Implement Student and Instructor login system (with roles). In terms of frontend, this will be programmed by creating two HTML files which will act as user interfaces for the "sign in" and "sign up" option. In terms of backend, this will be implemented using a javascript/Express.js file for the "sign in" option. There will also be another javascript/Express.js file for the "sign out" option. The info about the users such as instructors and students will be inside a txt file so that it can verify the user when they want to sign in or create a new user profile when they want to sign up.



Functionality for instructors to create teams and assign students to specific groups. (For example, importing a course roaster from a CSV file): In terms of frontend, one HTML file which will be the user interface page that the user will see once they log in. In that page, there will be button to create a team only if you are an instructor using the student ID. In terms of backend, every time a new team is made, a new line detailing the team number and their ID's will be written inside a txt file.

Ensure teams are visible to both students and instructors: In terms of front-end and back-end, the program (javascript file) will look at the teams txt file and display the team along with the team members in the user home page for both instructors and students.

