import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import connectToDatabase from './config/db.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/error.js';

import userRouter from './routes/user.js';
import groupRouter from './routes/group.js';
import auth from './middleware/auth.js';

dotenv.config();
connectToDatabase();

const app = express();

//middleware
app.use(cors({
  origin: 'https://finanso.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//router
app.use('/api/user', userRouter);
app.use('/api/group', auth, groupRouter);

//error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));