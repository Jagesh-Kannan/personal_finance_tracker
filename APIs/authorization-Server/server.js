import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import users_router from './routes/users.route.js';
import { handle_error } from "./controller/error.controller.js";
import { connection_error } from "./errorHandler/dbError.js";
import verifyEmail_router from "./routes/verifyEmail.router.js";

dotenv.config({ path: "./config.env" });


const app = express();
const port = process.env.PORT;
const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;



app.use(express.json());

app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

app.use("/api/v1/users", users_router);
app.use("/api/v1/verify-email", verifyEmail_router);

// Error handling middleware (must be last)
app.use(handle_error);

mongoose
  .connect(db_url, {
    dbName: db_name,
  })
  .then(() => {
    console.log("Successfully connected to DB.");
  })
  .catch(connection_error);