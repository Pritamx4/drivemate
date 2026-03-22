# Drive Mate - Car Rental Platform

A modern, full-stack car rental application built with React and Express.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

- User authentication (sign up, login)
- Admin panel for car and booking management
- Browse and search available cars
- Real-time booking system
- Admin authentication
- File upload for car images

## 🛠 Tech Stack

**Frontend:**
- React 19
- Vite (build tool)
- React Router DOM
- Lucide React (icons)
- React Helmet Async (SEO)

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT authentication
- BCryptJS (password hashing)
- Multer (file uploads)
- CORS enabled

## 📁 Project Structure

```
balaji/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (state management)
│   │   └── config.js      # Frontend config
│   ├── vite.config.js
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/            # DB connection & seed scripts
│   ├── controllers/       # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── uploads/           # File storage
│   ├── server.js
│   └── package.json
│
├── package.json           # Root package (for dev & deployment)
├── .env.example          # Environment variables template
└── .gitignore
```

## 🚀 Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB Atlas account (or local MongoDB)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repo-url>
cd balaji
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Setup environment variables**

Create `.env` file in the root directory:
```bash
cp .env.example .env
```

Fill in your actual values:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/drivemate
PORT=5000
JWT_SECRET=your_strong_random_secret_key
OWNER_WHATSAPP=+919876543210
```

Create `.env` file in the `server/` directory (if not using root .env):
```bash
cp server/.env.example server/.env
```

Create `.env.local` file in the `client/` directory (optional):
```bash
cp client/.env.example client/.env.local
```

## 💻 Development

### Run both frontend and backend
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Run only server
```bash
npm run dev:server
```

### Run only client
```bash
npm run dev:client
```

### Linting
```bash
npm run lint
```

## 📦 Deployment

### Build for Production

```bash
npm run build
```

This will:
1. Install dependencies for both client and server
2. Build the React frontend (optimized production bundle)

### Environment Variables
Before deploying, ensure all `.env` variables are set on your hosting platform:
- `MONGO_URI`
- `PORT`
- `JWT_SECRET`
- `OWNER_WHATSAPP`
- `VITE_API_URL` (for frontend)

### Deploy to Vercel (Frontend)

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel` in the `client/` directory
3. Add environment variables in Vercel dashboard

### Deploy to Render/Railway (Backend)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy button will build and run

### Deploy with Docker (Optional)

Create a `Dockerfile` at root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:client

EXPOSE 5000

CMD ["npm", "start"]
```

## 🔐 Security Notes

- Never commit `.env` file
- Keep `JWT_SECRET` safe and unique
- Use strong MongoDB passwords
- Enable CORS selectively in production
- Update dependencies regularly

## 📝 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run both server and client in dev mode |
| `npm run dev:server` | Run only server with hot-reload |
| `npm run dev:client` | Run only client with hot-reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run install:all` | Install all dependencies |
| `npm run lint` | Run ESLint on client |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📧 Support

For issues or questions, contact via WhatsApp: (stored in OWNER_WHATSAPP env variable)
