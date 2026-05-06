const { spawn } = require('child_process');

app.post('/upload-statement', (req, res) => {
    // Assuming you use 'express-fileupload' or 'multer' to get the file buffer
    const pdfBuffer = req.files.statement.data; 

    // Start the Python process
    const pythonProcess = spawn('python3', ['scraper.py']);

    let result = '';

    // Pipe the PDF buffer to Python's stdin
    pythonProcess.stdin.write(pdfBuffer);
    pythonProcess.stdin.end();

    // Listen for the data coming back from Python
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.on('close', (code) => {
        try {
            const transactions = JSON.parse(result);
            res.json({ success: true, data: transactions });
        } catch (e) {
            res.status(500).json({ error: "Failed to parse Python output" });
        }
    });
});
