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
import fileExtractor_route from './router/fileExtractor.route.js';
import fileUpload from 'express-fileupload';
import path from 'path';


dotenv.config({ path: './config.env' });

const app = express();
const port = process.env.PORT;
const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Use memory storage for privacy (no files saved to disk)
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    abortOnLimit: true
}));

const corsOptions = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : '*', // Allow all origins if ALLOWED_ORIGINS is not set
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP verbs
  allowedHeaders: ['Content-Type', 'Authorization'], // Essential for JWT/Auth
  credentials: true, // Required if sending cookies or Auth headers
};

app.use(cors(corsOptions));

app.use('/api/v1/expense', authenticate, expense_route);
app.use("/api/v1/users", users_router);
app.use("/verify-email", verifyEmail_router);
app.use("/api/v1/file-extractor", authenticate, fileExtractor_route);
// app.post('/extract-pdf', (req, res) => {
//     // 1. Check if a file named 'statement' was uploaded
//     if (!req.files || !req.files.statement) {
//         return res.status(400).json({ error: "Please upload a PDF file named 'statement'" });
//     }

//     const pdfBuffer = req.files.statement.data;

//     // 2. Spawn the Python process
//     // In Docker/Linux, we use 'python3'
//     const pythonProcess = spawn('python3', ['utils/my_pdf_scrapper.py']);

//     let resultData = '';
//     let errorData = '';

//     // 3. Pipe the PDF Buffer to Python's stdin
//     pythonProcess.stdin.write(pdfBuffer);
//     pythonProcess.stdin.end();

//     // 4. Capture standard output (The JSON result)
//     pythonProcess.stdout.on('data', (data) => {
//         resultData += data.toString();
//     });

//     // 5. Capture errors (Crucial for debugging OCR on Render)
//     pythonProcess.stderr.on('data', (data) => {
//         errorData += data.toString();
//     });

//     // 6. Handle process completion
//     pythonProcess.on('close', (code) => {
//         if (code !== 0) {
//             console.error(`Python process failed: ${errorData}`);
//             return res.status(500).json({ 
//                 error: "Extraction failed", 
//                 details: errorData 
//             });
//         }

//         try {
//             const jsonResponse = JSON.parse(resultData);
//             res.json({
//                 success: true,
//                 count: jsonResponse.length,
//                 data: jsonResponse
//             });
//         } catch (err) {
//             console.error("JSON Parse Error:", resultData);
//             res.status(500).json({ error: "Failed to parse data from Python" });
//         }
//     });
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



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


  