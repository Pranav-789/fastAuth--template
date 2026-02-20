import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5173'];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());

const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
    console.log("Server is up and running");
});

import authRouter from '../server/route/auth.routes.js'
import userRouter from '../server/route/user.routes.js'
import todoRouter from '../server/route/todo.route.js'
import blogRouter from '../server/route/blog.route.js'
import { prisma } from './db/prisma.js';
app.use('/api/auth', authRouter)

app.use('/api/user',userRouter);

app.use('/api/todo', todoRouter);
app.use('/api/blog', blogRouter);

// e.g. in some test route
app.get("/db-health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false });
    }
  });


app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});

export default app;