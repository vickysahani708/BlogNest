# Blog-Nest

**Blog-Nest** is a **full-stack blogging website** built using the **MERN stack**. Users can browse blogs, create their own posts, and log in with **Google authentication via Firebase**. The app has a modern UI using **Sadcn UI** and **Tailwind CSS**, and supports image uploads with **Cloudinary**.  

---

## Table of Contents
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Technologies
- **Frontend**: React, Sadcn UI, Tailwind CSS, Axios, React Router  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose)  
- **Authentication**: Firebase Google Login  
- **File Uploads**: Cloudinary  
- **Other**: JWT for backend session management  

---

## Features

### Client
- Browse and read blogs
- Search and filter blogs
- Create, edit, and delete personal blogs
- User authentication via **Google Login**
- Upload images with Cloudinary

### Admin / Dashboard (Optional)
- Manage users and blogs
- Approve or delete posts
- Dashboard analytics (if implemented)

### Server
- REST API endpoints for CRUD operations on blogs
- JWT-based authorization for protected routes
- Handles image uploads via Cloudinary
- Connects to MongoDB

---

## Installation

### Prerequisites
- Node.js (v14 or above)  
- MongoDB (local or Atlas)  
- npm / yarn  

### Steps
1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Blog-Nest.git
cd Blog-Nest
```
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

ENV file for Backend
PORT=5000
FRONTEND_URL='Your_frontend_url'
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV="Devlopment"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


ENV file for backend
VITE_API_BASE_URL="Backend_url"
VITE_FIREBASE_API="FireBase_API_Key"


# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm start

Blog-Nest/
│
├─ client/          # React frontend
│   ├─ src/
│   ├─ public/
│   └─ package.json
│
├─ server/          # Node/Express backend
│   ├─ controllers/
│   ├─ models/
│   ├─ routes/
│   ├─ middleware/
│   └─ server.js
│
├─ .gitignore
└─ README.md



