import sys, io, json, re, pdfplumber, pytesseract

def main():
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_transactions = []
    current_row = None
    
    # Regex to detect date at start of line (e.g., 01-09-2025)
    date_pattern = re.compile(r'^(\d{2}-\d{2}-\d{4})')

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            # 200 DPI is optimal for ICICI scanned clarity vs RAM usage
            img = page.to_image(resolution=200).original
            text = pytesseract.image_to_string(img, config='--psm 6')
            
            for line in text.split("\n"):
                line = line.strip()
                if not line or "Page" in line or "Total:" in line:
                    continue
                
                date_match = date_pattern.match(line)
                
                if date_match:
                    # If we were building a previous row, save it before starting new one
                    if current_row:
                        all_transactions.append(current_row)
                    
                    # Split line into parts
                    parts = re.split(r"\s{2,}", line)
                    
                    # Logic: date is parts[0]. Balance is always the last part.
                    # Deposits/Withdrawals are the 2nd/3rd to last parts.
                    # Everything in between is 'Particulars'.
                    date = parts[0]
                    balance = parts[-1]
                    
                    # Identify if it's a Deposit or Withdrawal based on position
                    # ICICI format: Date | Particulars | Deposits | Withdrawals | Balance
                    withdrawal = parts[-2] if len(parts) >= 4 else ""
                    deposit = parts[-3] if len(parts) >= 5 else ""
                    
                    # Join middle parts as the initial description
                    particulars = " ".join(parts[1:-3]) if len(parts) >= 5 else " ".join(parts[1:-1])

                    current_row = {
                        "date": date,
                        "particulars": particulars,
                        "deposit": deposit,
                        "withdrawal": withdrawal,
                        "balance": balance
                    }
                else:
                    # Continuation line: Append this text to the current row's particulars
                    if current_row:
                        current_row["particulars"] += " " + line

        # Add the very last row processed
        if current_row:
            all_transactions.append(current_row)

    # Clean up JSON: remove the B/F (Balance Brought Forward) row or rows without amounts
    final_data = [tx for tx in all_transactions if tx['date'] != 'DATE' and "B/F" not in tx['particulars']]

    sys.stdout.write(json.dumps(final_data))

if __name__ == "__main__":
    main()
