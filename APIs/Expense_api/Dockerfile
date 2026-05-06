# 1. Use a lightweight image that has both Python and Node.js
FROM nikolaik/python-nodejs:python3.11-nodejs20-slim

# 2. Install Tesseract OCR (the "eyes")
RUN apt-get update && apt-get install -y tesseract-ocr && apt-get clean

# 3. Set the working directory
WORKDIR /app

# 4. Install Node.js dependencies
COPY package*.json ./
RUN npm install

# 5. Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of your code (main.py, server.js, scraper.py)
COPY . .

# 7. Start your Node.js server
CMD ["node", "server.js"]
