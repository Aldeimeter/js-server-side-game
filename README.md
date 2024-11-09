# Multiplayer Game Project

This project is a server-side adaptation of a classic game, designed to support multiple players with additional functionalities like user registration, login, and scoring management. The game supports real-time gameplay with WebSockets and HTTP-based interactions, ensuring a seamless and responsive experience for all players.

## Features

1. **Server-side Game Processing**: Transitions the game logic to the server, allowing for centralized control and management of multiple games.
2. **Player Input Handling**: Receives player keypresses via HTTP requests and processes them on the server.
3. **Real-time Game Rendering**: Sends only the current game state to clients via WebSockets (on port `8082`), rendered on a `canvas`.
4. **Ship Selection**: Users can select a ship image, which is remembered per user session.
5. **Max Score Tracking**: Maintains max scores both for logged-in and guest users.
6. **Parallel Game Sessions**: Supports up to 1000 concurrent games.
7. **User Authentication**: Allows users to register and log in, including input validation for email, login, and password.
8. **Session Management**: Shares session data between the server and browser.
9. **Admin Interface**: An admin can view, delete users, and view current games.
10. **CSV Import/Export**: Admins can import/export user data (name, email, password, max score, and max speed).
11. **Object-Oriented Page Structure**: The webpage structure is represented using an object-oriented JSON format.
12. **Static Content Delivery**: Serves static content (`index.html` and JS files) and uses JSON for other interactions.
13. **Input Validation**: Validates user inputs to ensure email uniqueness, password hashing, and unique alphabetic logins. Unauthenticated users are given the login `[N/A]`.

## Setup and Run Instructions

### Prerequisites

- **Node.js**: Use either `node:23.0` or `node:lts`.
- **Docker and Docker Compose**: Ensure both are installed and Docker is running.

### Running the Project

1. Clone this repository:

   ```bash
    git clone <repository_url>
    cd <repository_directory>
   ```

2.

```bash
docker-compose build
docker-compose up

```
