import sys, io, json, re, pdfplumber, pytesseract

def main():
    # Read binary from Node.js
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_data = []
    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            # Try high-res OCR for scanned ICICI statements
            img = page.to_image(resolution=200).original # 200 DPI is safer for Render's RAM
            text = pytesseract.image_to_string(img, config='--psm 6')
            
            for line in text.split("\n"):
                if line.strip():
                    # Split columns by 2+ spaces
                    columns = re.split(r"\s{2,}", line.strip())
                    all_data.append(columns)

    sys.stdout.write(json.dumps(all_data))

if __name__ == "__main__":
    main()
