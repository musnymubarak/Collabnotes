# CollabNotes

A collaborative note-taking web app built with the MERN stack. Features JWT authentication, rich text editing, full-text search, and real-time collaborator management with role-based access control.


## Demo

Live: https://collabnotes.duckdns.org


---

## Features

- **JWT Auth** — access tokens (15 min) + HttpOnly refresh tokens (7 days) with silent refresh
- **Rich Text Editor** — TipTap (ProseMirror-based): bold, italic, headings, lists, code blocks
- **Full-Text Search** — MongoDB `$text` index on note title and content
- **Collaborator Management** — invite users by email, assign viewer/editor roles
- **Soft Deletes** — notes are never hard-deleted; marked `isDeleted` instead
- **Pagination** — server-side pagination with page/limit controls on the dashboard
- **Protected Routes** — frontend route guards + server-side middleware enforcement

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Zustand, TipTap, React Router v7 |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB |
| Auth | JWT (jsonwebtoken), bcryptjs, HttpOnly cookies |

---

## Project Structure

```
collabnotes/
├── client/          # React + Vite frontend
└── server/          # Express + Mongoose backend
```

---

## Prerequisites

- Node.js >= 20
- MongoDB (local or Atlas)
- npm

---

## Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd collabnotes
```

### 2. Setup the server

```bash
cd server
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### 3. Setup the client

```bash
cd client
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:5000` by default.

---

## Environment Variables

### `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/collabnotes` |
| `JWT_SECRET` | Secret for signing access tokens | any long random string |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens (use a different value) | any long random string |
| `CLIENT_URL` | CORS allowed origin — your frontend URL | `http://localhost:5173` |

### `client/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL for all API requests | `http://localhost:5000` |

---

## API Overview

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns access token + sets refresh cookie |
| POST | `/api/auth/refresh` | Silently refresh access token via cookie |
| POST | `/api/auth/logout` | Clear refresh token cookie |

### Notes

All routes require `Authorization: Bearer <accessToken>`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/notes` | Any member | List notes with search + pagination |
| POST | `/api/notes` | Authenticated | Create a note |
| GET | `/api/notes/:id` | Viewer+ | Get a single note |
| PUT | `/api/notes/:id` | Editor+ | Update title/content |
| DELETE | `/api/notes/:id` | Owner only | Soft delete |
| POST | `/api/notes/:id/collaborators` | Owner only | Add collaborator by email |
| PUT | `/api/notes/:id/collaborators/:userId` | Owner only | Update collaborator role |
| DELETE | `/api/notes/:id/collaborators/:userId` | Owner only | Remove collaborator |

---

## Assumptions & Design Decisions

- **No refresh token rotation/revocation** — tokens are stateless. A production system would use a token family model with a Redis blacklist. Out of scope for this assessment.
- **Manual save on NotePage** — autosave was omitted intentionally to keep the UX explicit. A debounced autosave would be the natural next step.
- **Collaborator email lookup** — users are found by exact email match. No fuzzy search.
- **Soft delete** — only the owner can delete. Collaborators are removed from the note, not redirected.

---

## Running in Production

```bash
# Build client
cd client && npm run build

# Start server (serve client/dist as static from Express, or deploy separately)
cd server && npm start
```

---

## Demo

> [Link to screen recording]
