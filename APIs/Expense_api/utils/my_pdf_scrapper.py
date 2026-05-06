import sys, io, json, re, ocrmypdf, pdfplumber

def is_date(val: str) -> bool:
    """Check if a string looks like a transaction date (dd-mm-yyyy or dd/mm/yyyy)."""
    if not val: 
        return False
    return bool(re.match(r"\d{2}[-/]\d{2}[-/]\d{4}", val.strip()))

def clean_amount(val: str) -> str:
    """Normalize OCR’d amount strings."""
    if not val: 
        return ""
    val = val.replace(",", "").replace("O", "0").replace("l", "1").strip()
    return val

def main():
    # 1. Read PDF bytes from Node.js
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes:
        sys.exit(1)

    # 2. OCR the PDF in memory
    input_pdf_io = io.BytesIO(input_bytes)
    output_pdf_io = io.BytesIO()
    try:
        ocrmypdf.ocr(
            input_pdf_io, output_pdf_io,
            force_ocr=True,
            optimize=0,
            output_type='pdf',
            progress_bar=False
        )
        output_pdf_io.seek(0)
    except Exception as e:
        sys.stderr.write(f"OCRmyPDF Error: {str(e)}")
        sys.exit(1)

    # 3. Extract transactions with pdfplumber
    all_transactions = []
    current_txn = None

    with pdfplumber.open(output_pdf_io) as pdf:
        for page in pdf.pages:
            table_settings = {
                "vertical_strategy": "text",
                "horizontal_strategy": "text",
                "snap_y_tolerance": 5,
                "intersection_x_tolerance": 15
            }
            table = page.extract_table(table_settings)
            if not table: 
                continue

            for row in table:
                row = [cell.strip() if cell else "" for cell in row]
                if not any(row): 
                    continue

                if is_date(row[0]):
                    # Start a new transaction
                    if current_txn:
                        all_transactions.append(current_txn)

                    deposit = clean_amount(row[2]) if len(row) > 2 else ""
                    withdrawal = clean_amount(row[3]) if len(row) > 3 else ""
                    balance = clean_amount(row[4]) if len(row) > 4 else ""
                    mode = "credited" if deposit else "debited"
                    amount = deposit if deposit else withdrawal

                    current_txn = {
                        "date": row[0],
                        "particulars": row[1] if len(row) > 1 else "",
                        "amount": amount,
                        "mode": mode,
                        "balance": balance
                    }
                else:
                    # Continuation line: merge into particulars
                    if current_txn:
                        extra_text = " ".join([c for c in row if c])
                        current_txn["particulars"] += " " + extra_text

    # Append the last transaction
    if current_txn:
        all_transactions.append(current_txn)

    # 4. Return structured JSON
    sys.stdout.write(json.dumps(all_transactions, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
