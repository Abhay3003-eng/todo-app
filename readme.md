// ...existing code...
# Todo App (React + Express/MongoDB)

A simple Todo application with a React frontend and an Express + MongoDB backend (todo-server).

## Features
- Create, read, update and delete todos
- Pagination support on the server
- JSON API suitable for a React SPA

## Requirements
- Node.js >= 14
- npm or yarn
- MongoDB (local or Atlas)

## Repository layout
- todo-server/ — Express API (controllers, models, routes)
- client/ — React frontend (if present)

## Environment
Create a `.env` in the server folder (todo-server) with at least:
```
MONGO_URI=mongodb://localhost:27017/todo-app
PORT=5000
```

## Install
From project root (or inside `todo-server` and `client` if separate):
```bash
npm install
# or, for client:
cd client && npm install
```

## Run (development)
Start server (from `todo-server`):
```bash
npm run dev
```
Start client (if present):
```bash
cd client
npm run dev
```

## API (server)
Base path: /api/todos
- GET /api/todos?page=1&limit=10 — list todos (paginated)
- GET /api/todos/:id — get single todo
- POST /api/todos — create todo (JSON: { "title": "...", "completed": false })
- PUT /api/todos/:id — update todo
- DELETE /api/todos/:id — delete todo

Responses follow a uniform ApiResponse structure (status, data, message).

## Scripts
Typical scripts (check package.json):
- npm run dev — start in development (nodemon)
- npm start — start production

## Contributing
1. Fork
2. Create feature branch
3. Commit & push
4. Open a PR

## License
MIT

// ...existing code...
{ updated }