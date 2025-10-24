# ChatVerse - Full Stack Real-Time Chat App

A complete real-time chat web application built with React, Node.js, Express.js, MySQL, and Socket.io. Features include user authentication, real-time messaging, online status, typing indicators, and more.

## 🚀 Features

### Authentication

- User registration and login
- JWT-based authentication with HttpOnly cookies
- Password hashing with bcryptjs
- Secure logout functionality

### Real-Time Chat

- One-to-one messaging
- Real-time message delivery with Socket.io
- Online/offline status indicators
- Typing indicators
- Message timestamps

### User Management

- User profiles with bio and avatar support
- Profile editing capabilities
- Password change functionality
- Account deletion

### UI/UX

- Modern, responsive design with TailwindCSS
- Dark mode support
- Real-time updates
- Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd chatverse
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
npm install --prefix server

# Install client dependencies
npm install --prefix client
```

### 3. Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE chatverse;
```

2. Import the database schema:

```bash
psql -U postgres -d chatverse -f server/database/schema.sql
```

3. Update database configuration in `server/config/db.js` if needed.

### 4. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=chatverse
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 5. Start the application

#### Development Mode (Both frontend and backend)

```bash
npm run dev
```

#### Start individually

```bash
# Start backend server
npm run start --prefix server

# Start frontend (in another terminal)
npm run dev --prefix client
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
chatverse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts
│   │   └── ...
│   └── package.json
├── server/              # Node.js backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middlewares
│   ├── routes/         # API routes
│   ├── database/       # Database schema
│   └── server.js       # Main server file
└── package.json        # Root package.json
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/password` - Change password
- `DELETE /api/users/delete` - Delete account
- `GET /api/users/all` - Get all users

### Messages

- `GET /api/messages/:userId` - Get messages with a user
- `POST /api/messages/send` - Send a message

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Select User**: Choose a user from the sidebar to start chatting
3. **Send Messages**: Type and send real-time messages
4. **Profile Management**: Update your profile and settings
5. **Real-time Features**: See online status and typing indicators

## 🔒 Security Features

- JWT tokens stored in HttpOnly cookies
- Password hashing with bcryptjs
- CORS protection
- Rate limiting
- Input validation
- SQL injection protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend: `npm run build --prefix client`
2. Deploy the `client/dist` folder

### Backend (Render/Railway)

1. Set environment variables
2. Deploy the `server` folder

### Database (Render/Neon/Supabase)

1. Create a PostgreSQL database
2. Import the schema
3. Update connection string

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Chatting! 💬**
