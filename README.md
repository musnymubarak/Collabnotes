# CollabNotes

A collaborative note-taking web application built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Features

- **JWT Authentication** — Secure register/login with access + refresh token flow (httpOnly cookies)
- **Rich Text Editor** — TipTap-based editor with bold, italic, strikethrough, lists, quotes, code blocks
- **Full-Text Search** — MongoDB text index on note title and content for instant search
- **Collaborator Management** — Invite users by email, assign viewer/editor roles, update or remove access
- **Protected Routes** — Client-side route guards with automatic token refresh on 401 responses

## Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Frontend  | React 19, React Router, Zustand, TipTap, Axios  |
| Styling   | Tailwind CSS v4 (via @tailwindcss/vite plugin)   |
| Backend   | Node.js, Express 5                               |
| Database  | MongoDB with Mongoose ODM                        |
| Auth      | JWT (access + refresh tokens), bcryptjs           |

## Project Structure

```
CollabNotes/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios instance & API helpers
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Route-level page components
│   │   └── store/           # Zustand state management
│   └── .env.example
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, access control, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   └── utils/           # JWT helper functions
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or a cloud URI)

### 1. Clone the repository

```bash
git clone <repository-url>
cd CollabNotes
```

### 2. Setup the server

```bash
cd server
cp .env.example .env        # then edit .env with your values
npm install
npm run dev                  # starts with nodemon on port 5000
```

### 3. Setup the client

```bash
cd client
cp .env.example .env        # then edit .env if needed
npm install
npm run dev                  # starts Vite dev server on port 5173
```

### 4. Open the app

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint   | Description             |
| ------ | ---------- | ----------------------- |
| POST   | /register  | Create a new account    |
| POST   | /login     | Login & receive tokens  |
| POST   | /refresh   | Refresh access token    |
| POST   | /logout    | Clear refresh cookie    |

### Notes (`/api/notes`) — *Protected*

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| GET    | /                             | List user's notes (search)  |
| POST   | /                             | Create a new note           |
| GET    | /:id                          | Get a single note           |
| PUT    | /:id                          | Update title/content        |
| DELETE | /:id                          | Soft-delete a note          |
| POST   | /:id/collaborators            | Add a collaborator          |
| PUT    | /:id/collaborators/:userId    | Update collaborator role    |
| DELETE | /:id/collaborators/:userId    | Remove a collaborator       |

## Environment Variables

### Server (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/collabnotes
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
```

### Client (`.env`)

```env
VITE_API_URL=http://localhost:5000
```
