# 1. Use a lightweight image that has both Python and Node.js
FROM nikolaik/python-nodejs:python3.11-nodejs20-slim

# 2. Install Tesseract AND the extra tools required for OCRmyPDF
# ghostscript: handles PDF rendering
# unpaper: cleans up scanned images
# qpdf: handles PDF structural changes
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    ghostscript \
    unpaper \
    qpdf \
    libpng-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. Set the working directory
WORKDIR /app

# 4. Install Node.js dependencies
COPY package*.json ./
RUN npm install

# 5. Install Python dependencies
# IMPORTANT: Ensure 'ocrmypdf' and 'pdfplumber' are in your requirements.txt
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of your code
COPY . .

# 7. Start your Node.js server
# Render uses the PORT env variable automatically
CMD ["node", "server.js"]
