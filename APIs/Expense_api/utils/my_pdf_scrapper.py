import sys, io, json, re, pdfplumber, pytesseract

def main():
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_transactions = []
    current_tx = None
    last_balance = 0.0
    pre_buffer = []  # To store particulars found BEFORE a date row
    table_started = False
    
    # Regex Patterns
    date_pattern = r'^\d{2}-\d{2}-\d{4}'
    amount_pattern = r'^-?\d[\d,.]*\.\d{2}$' # Matches 290.00 or 2,97,611.36

    custom_config = r'--psm 6 -c preserve_interword_spaces=1'

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            img = page.to_image(resolution=200).original
            text = pytesseract.image_to_string(img, config=custom_config)
            
            for line in text.split("\n"):
                line = line.strip()
                if not line: continue

                # 1. Detect Table Start
                if "DATE" in line and "PARTICULARS" in line and "BALANCE" in line:
                    table_started = True
                    continue
                
                # 2. Detect Table End (Current Page)
                if "Total:" in line:
                    table_started = False
                    continue

                if not table_started: continue

                # Split by space to analyze components
                parts = line.split()
                first_word = parts[0]
                is_date = re.match(date_pattern, first_word)

                # 3. Handle B/F (Balance Brought Forward) - Set starting balance
                if is_date and "B/F" in line:
                    amounts = [p for p in parts if re.match(amount_pattern, p)]
                    if amounts:
                        last_balance = float(amounts[-1].replace(',', ''))
                    continue

                # 4. Handle a New Row (Starts with Date)
                if is_date:
                    # Save the previous transaction if it exists
                    if current_tx:
                        all_transactions.append(current_tx)

                    # Extract Amounts from the end
                    # last is Balance, second last is Transaction Amount
                    amounts_in_line = [p for p in parts if re.match(amount_pattern, p)]
                    
                    bal_val = amounts_in_line[-1] if len(amounts_in_line) >= 1 else "0.00"
                    amt_val = amounts_in_line[-2] if len(amounts_in_line) >= 2 else "0.00"

                    # Particulars are everything between date and the first amount
                    # We find indices to be precise
                    particulars_list = []
                    found_amt = False
                    for p in parts[1:]:
                        if re.match(amount_pattern, p):
                            found_amt = True
                            break
                        particulars_list.append(p)
                    
                    current_particulars = " ".join(particulars_list)

                    # Add -pre buffer if any text was collected before this date
                    if pre_buffer:
                        current_particulars = " ".join(pre_buffer) + " -pre " + current_particulars
                        pre_buffer = []

                    # Mode Logic: Compare with last_balance
                    curr_bal_float = float(bal_val.replace(',', ''))
                    mode = "credited" if curr_bal_float > last_balance else "debited"
                    last_balance = curr_bal_float

                    current_tx = {
                        "date": first_word,
                        "particulars": current_particulars,
                        "amount": amt_val,
                        "balance": bal_val,
                        "mode": mode
                    }

                # 5. Handle Continuation Lines (Particulars only)
                else:
                    if current_tx:
                        # Check if this line ends with '/' (The -pst rule)
                        if line.endswith('/'):
                            current_tx["particulars"] += " -pst " + line
                        else:
                            # If the previous transaction was already "closed" by a '/',
                            # this text belongs to the NEXT row (pre-buffer)
                            if "-pst" in current_tx["particulars"]:
                                pre_buffer.append(line)
                            else:
                                current_tx["particulars"] += " " + line
                    else:
                        # Text found before the very first transaction
                        pre_buffer.append(line)

        # Append final transaction
        if current_row:
            all_transactions.append(current_tx)

    sys.stdout.write(json.dumps(all_transactions))

if __name__ == "__main__":
    main()
