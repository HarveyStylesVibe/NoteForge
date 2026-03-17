# NoteForge

**NoteForge** is a streamlined note-taking application designed for simplicity and efficiency. It allows users to create, organize, and manage notes effortlessly, with a clean interface and responsive design, backed by a robust full-stack architecture.

---

## 🧩 Features

- User authentication using **JWT** (signup, login, logout)  
- Full **CRUD** functionality for notes: create, read, update, delete  
- **Note recovery** for accidentally deleted notes  
- Responsive **React** frontend with clean UI  
- RESTful API built with **Node.js** and **Express.js**  
- **MongoDB** database for persistent data storage  

---

## 🛠 Tech Stack

- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT (JSON Web Tokens)  
- **API:** RESTful endpoints for notes and user management  

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/signup | Register a new user |
| POST   | /api/login | Authenticate user and return JWT |
| GET    | /api/notes | Get all notes for the logged-in user |
| POST   | /api/notes | Create a new note |
| PUT    | /api/notes/:id | Update an existing note |
| DELETE | /api/notes/:id | Delete a note |
| PATCH  | /api/notes/recover/:id | Recover a deleted note |

---
