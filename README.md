# Blog App

A full-stack web application for creating and managing blogs, along with user authentication. Built with React on the frontend and Express.js with Prisma on the backend.

## 🌟 Features

- **User Authentication**: Register, login, and JWT-based session management
- **Blog Management**: Create, read, update, delete, like, and comment on blog posts
- **User Profiles**: Manage user information, follow/unfollow users, and view their blogs
- **Protected Routes**: Secure routes with JWT authentication
- **Email Notifications**: Email integration using Nodemailer
- **Password Security**: Encrypted passwords with bcryptjs
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **TypeScript** - Type safety
- **Vite** 7.3.1 - Build tool and dev server
- **React Router DOM** 7.13.0 - Client-side routing
- **Tailwind CSS** 3.4.19 - Utility-first CSS
- **Axios** 1.13.5 - HTTP client
- **ESLint** - Code linting

### Backend
- **Express.js** 5.2.1 - Web framework
- **Node.js/TypeScript** - Server runtime
- **Prisma** 7.3.0 - ORM for database
- **PostgreSQL** 8.18.0 - Database
- **JWT** 9.0.3 - JSON Web Tokens for auth
- **bcryptjs** 3.0.3 - Password hashing
- **Nodemailer** 8.0.1 - Email service
- **CORS** 2.8.6 - Cross-origin resource sharing
- **Cookie Parser** 1.4.7 - Cookie middleware

## 📁 Project Structure

```
blogApp/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── Layout.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Todos.tsx
│   │   ├── lib/
│   │   │   └── api.ts     # API client configuration
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── eslint.config.js
│
└── server/                # Express backend application
    ├── src/
    │   ├── controller/    # Route controllers
    │   │   ├── auth.controller.ts
    │   │   ├── todo.controller.ts
    │   │   └── user.controller.ts
    │   ├── route/         # Route definitions
    │   │   ├── auth.routes.ts
    │   │   ├── todo.route.ts
    │   │   └── user.routes.ts
    │   ├── middleware/    # Express middleware
    │   │   └── verifyJwt.ts
    │   ├── db/            # Database configuration
    │   │   └── prisma.ts
    │   ├── types/         # TypeScript type definitions
    │   │   └── express.d.ts
    │   ├── utils/         # Utility functions
    │   │   ├── generateTokens.ts
    │   │   └── mailer.ts
    │   ├── server.ts      # Main server file
    │   └── prisma.config.ts
    ├── prisma/            # Prisma ORM configuration
    │   ├── schema.prisma  # Database schema
    │   └── migrations/    # Database migrations
    ├── generated/         # Generated Prisma client
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blogApp
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   cd ..
   ```

4. **Setup environment variables**

   Create a `.env` file in the `server` directory:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/blogapp"
   JWT_SECRET="your_secret_key_here"
   MAIL_HOST="smtp.gmail.com"
   MAIL_PORT=587
   MAIL_USER="your_email@gmail.com"
   MAIL_PASS="your_app_password"
   ```

5. **Setup database**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

## 📦 Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run server
```
The server will run on `http://localhost:3000`

**Terminal 2 - Start Frontend Development Server:**
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
```

**Build Backend:**
```bash
cd server
npm run build
```

## 🔐 Authentication Flow

1. User registers with email and password
2. Server hashes password and stores in PostgreSQL
3. On login, credentials are verified
4. JWT tokens are generated and sent via cookies
5. Protected routes verify JWT token via middleware
6. Tokens refresh on each request

## 🧪 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Blog Routes
- `GET /api/blog/recent/:pageNum` - Get recent blogs
- `GET /api/blog/popular/:pageNum` - Get popular blogs
- `GET /api/blog/get/:postId` - Get specific blog post
- `POST /api/blog/create` - Create new blog post
- `PUT /api/blog/update` - Update blog post
- `DELETE /api/blog/delete` - Delete blog post
- `POST /api/blog/like` - Like a blog post
- `POST /api/blog/comment` - Comment on a blog post

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user account

## 📝 Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run start` - Start server (production)
- `npm run server` - Start with nodemon (development)
- `npm run build` - Compile TypeScript

## 🔄 Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User**: Stores user information (email, password, profile, followers, following)
- **Blog**: Stores blog posts, likes, and comments with user associations
- **Session**: Manages user sessions

See [server/prisma/schema.prisma](server/prisma/schema.prisma) for the complete schema.

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes with middleware
- CORS configuration
- Input validation
- Secure cookie handling

## 📧 Email Configuration

The application uses Nodemailer for sending emails. Configure SMTP settings in your `.env` file to enable email notifications.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👤 Author

Pranav

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Happy Coding!** 🎉
