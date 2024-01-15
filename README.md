# CoWrite - Cooperative Writing Platform
CoWrite is a collaborative writing platform that allows users to work together on documents in real-time. This project utilizes a Vite React app for the client, with Node.js, Socket.IO, and MongoDB for the server. Users can create and edit documents simultaneously, with changes being instantly reflected across all connected clients.

# Installation

1. Clone the repository:
   `git clone https://github.com/your-username/CoWrite.git`
2. Install dependencies for both the client and server:
   ```bash
   # Navigate to the client directory
   cd CoWrite/client
   npm install

   # Navigate to the server directory
   cd ../server
   npm install
   ```
3. Start the client and server:
   ```bash
   # Start the client (Vite React app)
   cd ../client
   npm run dev

   # Start the server (Node.js)
   cd ../server
   npm start
   ```

# Usage
1.Open your web browser and go to http://localhost:3000 to access the CoWrite application.

2.Create a new document or enter an existing document ID.

3.Share the document ID with collaborators.

4.Collaborate in real-time on the document.

# Technologies Used
React
Vite
Node.js
Socket.IO
MongoDB

# Client
The client side of CoWrite is a Vite-based React application that utilizes the Quill text editor. It establishes a socket connection to the server for real-time collaboration.

# Client Installation

```bash
  cd CoWrite/client
  npm install
```

# Client Usage
Start the client application:

```bash
npm run dev
```

