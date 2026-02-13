import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;
app.get('/', (req, res) => {
    console.log("Server is up and running");
});
import authRouter from '../server/route/auth.routes.js';
app.use('/api/auth', authRouter);
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
