import sys, io, json, ocrmypdf, pdfplumber

def main():
    # 1. Read binary from Node.js
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    # 2. Use OCRmyPDF to add a text layer (in-memory)
    # --sidecar: ensures we don't need to write a physical file
    # --ocr-timeout: prevents timeout on heavy scanned PDFs
    input_pdf_io = io.BytesIO(input_bytes)
    output_pdf_io = io.BytesIO()

    try:
        ocrmypdf.ocr(input_pdf_io, output_pdf_io, 
                    force_ocr=True, 
                    optimize=0, 
                    output_type='pdf',
                    progress_bar=False)
        
        output_pdf_io.seek(0)
    except Exception as e:
        sys.stderr.write(f"OCRmyPDF Error: {str(e)}")
        sys.exit(1)

    # 3. Use pdfplumber on the newly searchable PDF
    all_transactions = []
    last_balance = None

    with pdfplumber.open(output_pdf_io) as pdf:
        for page in pdf.pages:
            # ICICI usually has no vertical lines. 
            # 'text' strategy uses the alignment of text to find columns.
            table_settings = {
                "vertical_strategy": "text",
                "horizontal_strategy": "text",
                "snap_y_tolerance": 5,
                "intersection_x_tolerance": 15
            }
            
            table = page.extract_table(table_settings)
            if not table: continue

            for row in table:
                # Clean row and filter empty ones
                row = [cell.strip() if cell else "" for cell in row]
                if not any(row) or "DATE" in row[0]: continue

                # ICICI Table Mapping: 
                # [Date, Mode/Particulars, Deposits, Withdrawals, Balance]
                # Note: OCRmyPDF makes these columns much more stable
                date = row[0]
                particulars = row[1]
                deposit = row[2]
                withdrawal = row[3]
                balance = row[4]

                # Identify Mode based on which column has data
                mode = "credited" if deposit and not withdrawal else "debited"

                all_transactions.append({
                    "date": date,
                    "particulars": particulars,
                    "amount": deposit if mode == "credited" else withdrawal,
                    "mode": mode,
                    "balance": balance
                })

    # Return structured JSON
    sys.stdout.write(json.dumps(all_transactions))

if __name__ == "__main__":
    main()
