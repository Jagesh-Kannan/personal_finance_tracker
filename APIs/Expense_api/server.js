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
import { spawn } from 'child_process';
import fileUpload from 'express-fileupload';
import * as XLSX from 'xlsx';
import path from 'path';

dotenv.config({ path: './config.env' });

const app = express();
const port = process.env.PORT;
const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

app.use(express.json());
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
app.post('/extract-pdf', (req, res) => {
    // 1. Check if a file named 'statement' was uploaded
    if (!req.files || !req.files.statement) {
        return res.status(400).json({ error: "Please upload a PDF file named 'statement'" });
    }

    const pdfBuffer = req.files.statement.data;

    // 2. Spawn the Python process
    // In Docker/Linux, we use 'python3'
    const pythonProcess = spawn('python3', ['utils/my_pdf_scrapper.py']);

    let resultData = '';
    let errorData = '';

    // 3. Pipe the PDF Buffer to Python's stdin
    pythonProcess.stdin.write(pdfBuffer);
    pythonProcess.stdin.end();

    // 4. Capture standard output (The JSON result)
    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    // 5. Capture errors (Crucial for debugging OCR on Render)
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    // 6. Handle process completion
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python process failed: ${errorData}`);
            return res.status(500).json({ 
                error: "Extraction failed", 
                details: errorData 
            });
        }

        try {
            const jsonResponse = JSON.parse(resultData);
            res.json({
                success: true,
                count: jsonResponse.length,
                data: jsonResponse
            });
        } catch (err) {
            console.error("JSON Parse Error:", resultData);
            res.status(500).json({ error: "Failed to parse data from Python" });
        }
    });
});

app.post('/extract-excel', (req, res) => {
    try {
        if (!req.files || !req.files.excelFile) {
            return res.status(400).json({ error: "Please upload an Excel file named 'excelFile'" });
        }

        const workbook = XLSX.read(req.files.excelFile.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const formattedData = rawData.map(row => {
            const remarks = row['transaction remark'] || "";
            const splitRemarks = remarks.split('/');
            
            // Remark Splitting Logic
            const modeKey = splitRemarks[0]?.trim().toUpperCase();
            const receiverName = splitRemarks[1]?.trim() || "Unknown";
            const userNote = splitRemarks[3]?.trim() || "General Transaction";
            
            // Amount and Transaction Mode Logic
            const withdrawal = parseFloat(row['withdrawal amount']) || 0;
            const deposit = parseFloat(row['deposit amount']) || 0;
            const amount = withdrawal > 0 ? withdrawal : deposit;
            const mode = withdrawal > 0 ? "DEBITED" : "CREDITED";

            // Payment Mode Mapping Logic
            let paymentMode = 'BANK_TRANSFER';
            if (modeKey.includes('UPI')) paymentMode = 'UPI';
            else if (['PAVC'].some(k => modeKey.includes(k))) paymentMode = 'CREDIT CARD';
            else if (['VPS', 'IPS'].some(k => modeKey.includes(k))) paymentMode = 'DEBIT CARD';
            else if (modeKey.includes('CMS')) paymentMode = 'CHEQUE';
            else if (['CCWD', 'CWD', 'VAT', 'MAT', 'NFS'].some(k => modeKey.includes(k))) paymentMode = 'CASH';

            return {
                expenseName: `${userNote} ${modeKey}`,
                expenseCategory: userNote,
                amount: amount,
                paymentMode: paymentMode,
                mode: mode,
                expenseDate: row['transaction date'] ? new Date(row['transaction date']).toISOString() : new Date().toISOString(),
                notes: remarks,
                currency: "INR",
                customGrouping: receiverName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        });

        res.json({ success: true, count: formattedData.length, data: formattedData });

    } catch (error) {
        console.error("Processing Error:", error);
        res.status(500).json({ error: "Table structure error or invalid file format" });
    }
});


// Health check for Render
app.get('/', (req, res) => res.send('PDF Scraper Service is Online'));

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


  