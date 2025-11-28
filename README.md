RBAC Demo App (Intentionally Vulnerable)
This is a small demo application designed to demonstrate how improper access control can lead to a privilege escalation vulnerability. The logic is based on a real bug bounty case where a member-level user was able to escalate to owner privileges by manipulating a request, even though the user interface prevented that action. The application consists of a minimal Node.js/Express backend and a simple HTML/CSS/JS frontend. MongoDB Atlas is used as the database.
The goal of the project is to illustrate a common access control flaw: the frontend blocks low-privileged users from changing roles, but the backend does not enforce any server-side permission checks. As a result, a member can use Burp Suite to send a crafted request and successfully escalate privileges.

How to run the application
1.Install dependencies: 
npm install

2.Create a .env file:
MONGO_URI=your_mongodb_uri
JWT_SECRET=secret
PORT=3000

3.Start the server:
npm run dev

4.Open the frontend:
http://localhost:3000/index.html

How the app works:
Users start on the login page. After a successful login, they are redirected to the workspace creation screen. The JWT token is stored in localStorage and is used for all authenticated API requests.
When a user creates a workspace, they automatically become the owner and gain permission to manage access levels. A second user who logs in is automatically treated as a member. Members can see the UI elements for changing access levels, but the “Change Access” button is disabled for them. However, the backend does not verify user roles, so a member can intercept the request with Burp Suite, modify the parameters, and successfully escalate their privileges. This setup mirrors the original vulnerability: the frontend restricts the action, but the backend does not enforce any authorization logic.

Project structure
rbac-demo/
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   └── Workspace.js
│
├── routes/
│   ├── auth.js
│   └── workspace.js
│
├── public/
│   ├── index.html
│   ├── workspace.html
│   ├── add-member.html
│   ├── change_role.html
│   └── script.js
│
├── server.js
└── package.json

How to reproduce the vulnerability

This vulnerability replicates a real bug I discovered on HackerOne.
The issue is caused by missing server-side authorization checks: the backend allows any authenticated user to change access levels inside a workspace, regardless of their role.
Below is the exact flow that demonstrates the escalation from member to full access / owner.
Reproduction steps 
Open the application and perform the following:
• Log in as the owner account
• Create a workspace
• Add a second user as a member
• Go to the “Change Access” page and change the member’s access level to something low (for example, “read”)
• Intercept this request in Burp Suite
• Drop the request from the browser so the UI does not apply the change
• Modify the intercepted request in Burp:
– Replace the owner’s token or cookies with the member’s token
– Keep the JSON body exactly the same (targetUserId, newAccessLevel, etc.)
• Send the modified request to the server
Because the backend does not verify whether the requester actually has permission to perform this action, the request succeeds.
The result is that the member user is now promoted to full access (or even owner), even though:
• the member UI had the button disabled
• the member was not allowed to perform this action through the frontend
• only the owner should be able to change access levels
This reproduces the same logical flaw from the original HackerOne report.
