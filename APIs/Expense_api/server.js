import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { connection_error } from './errorHandler/dbError.js';
import { handle_error } from './controller/error.controller.js';
import { authenticate } from './middleware/auth.middleware.js';
import expense_route from './router/expense.route.js';
import users_router from './router/users.route.js';
import verifyEmail_router from "./router/verifyEmail.router.js";


dotenv.config({ path: './config.env' });

const app = express();
const port = process.env.PORT;
const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];



const corsOptions = {
  origin: 'https://personal-finance-tracker-b9lc.onrender.com', // Allow all origins if ALLOWED_ORIGINS is not set
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP verbs
  allowedHeaders: ['Content-Type', 'Authorization'], // Essential for JWT/Auth
  credentials: true, // Required if sending cookies or Auth headers
};

console.log("allowed origins", allowedOrigins);

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use(express.json());
app.use(cookieParser());


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

app.use('/api/v1/expense', authenticate, expense_route);
app.use("/api/v1/users", users_router);
app.use("/api/v1/verify-email", verifyEmail_router);

// Error handling middleware (must be last)
app.use(handle_error);

mongoose
  .connect(db_url, {
    dbName: db_name,
  })
  .then(() => {
    console.log('Successfully connected to DB.');
  })
  .catch(connection_error);
