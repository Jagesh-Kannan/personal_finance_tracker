import { catchAsync } from '../utils/catchAsync.js';
import { extractExcelData } from '../utils/excelDataExtracter.js';
import { extractPdfData } from '../utils/pdfDataExtractor.js';

export const extract_file_data = catchAsync(async (req, res, next) => {
    // 1. File existence check
    if (!req.files || !req.files.statementFile) {
        return res.status(400).json({ error: "Please upload a file named 'statementFile'" });
    }

     const excelAndCsvTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel',                                         // .xls
        'text/csv',                                                         // .csv (Standard)
        'application/csv',                                                  // .csv (Alternative)
        'text/plain'                                                        // .csv (Sometimes detected as plain text)
    ];

    const uploadedFile = req.files.statementFile;
    const mimeType = uploadedFile.mimetype;
    let extractedData = [];

    try {
        // 2. Route logic based on file type
        if (mimeType === 'application/pdf') {
            // Await the Promise from our PDF utility
            extractedData = await extractPdfData(uploadedFile.data);
            
        } else if (excelAndCsvTypes.includes(mimeType)) {
            // Excel extraction
            extractedData = extractExcelData(uploadedFile.data);
            
        } else {
            return res.status(400).json({ error: "Unsupported file type. Please upload a PDF or Excel file." });
        }

        // 3. Uniform Success Response
        res.status(200).json({
            status: 'success',
            count: extractedData.length,
            data: extractedData
        });

    } catch (err) {
        // Handle logic errors (Python crash, Excel structure error, etc.)
        console.error("Extraction Error:", err.message);
        res.status(500).json({ 
            error: "Extraction failed", 
            details: err.message 
        });
    }
});
