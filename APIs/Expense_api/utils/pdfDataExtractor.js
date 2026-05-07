import { spawn } from 'child_process';

export const extractPdfData = (pdfBuffer) => {
    return new Promise((resolve, reject) => {
        // Spawn the Python process
        const pythonProcess = spawn('python3', ['my_pdf_scrapper.py']);
        
        let resultData = '';
        let errorData = '';

        // Pipe the buffer into Python's stdin
        pythonProcess.stdin.write(pdfBuffer);
        pythonProcess.stdin.end();

        // Collect outputs
        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        // Resolve or Reject based on exit code
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Python process failed: ${errorData}`));
            }

            try {
                const jsonResponse = JSON.parse(resultData);
                resolve(jsonResponse);
            } catch (err) {
                reject(new Error("Failed to parse JSON from Python output"));
            }
        });
    });
};
