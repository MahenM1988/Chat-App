**Real-Time Chat App - Backend Overview**

This project implements a real-time chat application using **Node.js**,
**Express.js**, **Socket.io**, and **Passport.js** for authentication.
It provides a simple messaging platform where users can connect, join a
chat room, and send messages to all connected clients in real-time.

**Key Technologies:**

-   **Express.js**: Used for handling HTTP requests and setting up the
    server.

-   **Socket.io**: Provides real-time, bi-directional communication
    between the client and server.

-   **Passport.js**: Handles user authentication.

-   **MongoDB**: Set up for future use to store user data and chat
    history.

-   **bcryptjs**: Used for securely hashing passwords.

-   **dotenv**: Loads environment variables from a .env file for secure
    configuration.

**How the Code Works:**

1.  **Server Setup**

    -   The server is created using **Express.js** and listens on a port
        (default 5000).

    -   An **HTTP server** is set up to handle both HTTP requests and
        WebSocket connections, allowing real-time communication through
        Socket.io.

2.  **CORS Configuration**

    -   **CORS (Cross-Origin Resource Sharing)** is enabled to allow the
        frontend (React app running on localhost:3000) to send requests
        to the backend server.

    -   This configuration allows the backend to accept requests from
        different origins (like the React app) while keeping the server
        secure.

3.  **Socket.io Integration**

    -   **Socket.io** is used to handle real-time messaging between the
        server and clients. When a client connects, a WebSocket
        connection is established.

    -   The server listens for events such as a user joining the chat or
        sending messages, and it broadcasts messages to all connected
        clients.

4.  **MongoDB Connection**

    -   The app connects to **MongoDB** using Mongoose, although it's
        not fully implemented yet. In future updates, MongoDB will be
        used to store user data and chat history.

5.  **User Authentication with Passport.js**

    -   **Passport.js** handles user login and session management. For
        now, the app uses hardcoded dummy users (Admin1 and Admin2) for
        authentication.

    -   **bcryptjs** is used to securely hash the users\' passwords
        before storing them, and **Passport Local Strategy** is used to
        verify the credentials when users log in.

6.  **Session Management**

    -   **express-session** middleware is used to manage user sessions.
        This allows users to stay logged in for the duration of their
        session (default is 1 day).

    -   The session cookie is protected with settings to prevent access
        from JavaScript and to ensure secure cookies are used in
        production.

7.  **Login and Logout Routes**

    -   **Login Route**: Users can log in by sending a POST request with
        their credentials. If authentication is successful, a session is
        created for the user, and the server responds with the username.

    -   **Logout Route**: Users can log out by sending a POST request,
        which terminates their session and logs them out of the app.

8.  **Serving Static Files (Frontend)**

    -   The backend serves the static files of the React frontend (once
        the app is built). This is done by serving the build folder,
        enabling the backend and frontend to be deployed together as a
        single application.

9.  **Real-Time Chat with Socket.io**

    -   The main feature of the app is real-time chat functionality,
        powered by **Socket.io**. When a user connects to the chat,
        their information (username and socket ID) is saved in a **Map**
        on the server.

    -   The server listens for incoming messages from users, and when a
        message is received, it is broadcast to all other connected
        clients. This allows real-time communication between users in
        the chat.

**Next Steps:**

-   **User Authentication**: Replace the dummy user data with a real
    user model connected to MongoDB, enabling persistent user
    authentication.

-   **Persistent Storage**: Implement a feature to store chat messages
    in MongoDB, allowing users to view message history.

-   **Private Chat Rooms**: Add functionality for users to create
    private chat rooms for one-on-one or group conversations.

By setting up the backend with these features, the app is designed to be
both functional and scalable, with room for future improvements.
