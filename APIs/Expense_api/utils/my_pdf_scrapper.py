import sys, io, json, re, pdfplumber, pytesseract

def clean_currency(val):
    """
    Handles messy OCR numbers like '2.99.449.36' or '2,99,449.36'
    and converts them to a clean float.
    """
    if not val: return 0.0
    # Remove everything except digits
    digits = re.sub(r'[^0-9]', '', val)
    if len(digits) > 2:
        # Bank amounts always have 2 decimal places. 
        # Re-insert the dot before the last two digits.
        return float(digits[:-2] + '.' + digits[-2:])
    return float(digits) if digits else 0.0

def main():
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_transactions = []
    current_tx = None
    last_balance = 0.0
    pre_buffer = []
    table_started = False
    
    date_pattern = r'^\d{2}-\d{2}-\d{4}'
    # Match strings that look like money (digits, dots, commas)
    amount_pattern = r'[\d,.]+\.\d{2}'

    custom_config = r'--psm 6 -c preserve_interword_spaces=1'

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            img = page.to_image(resolution=200).original
            text = pytesseract.image_to_string(img, config=custom_config)
            
            for line in text.split("\n"):
                line = line.strip()
                if not line: continue

                if "DATE" in line and "PARTICULARS" in line:
                    table_started = True
                    continue
                
                if "Total:" in line:
                    table_started = False
                    continue

                if not table_started: continue

                parts = line.split()
                is_date = re.match(date_pattern, parts[0]) if parts else False

                if is_date and "B/F" in line:
                    amounts = re.findall(amount_pattern, line)
                    if amounts:
                        last_balance = clean_currency(amounts[-1])
                    continue

                if is_date:
                    if current_tx: all_transactions.append(current_tx)

                    amounts_in_line = re.findall(amount_pattern, line)
                    
                    bal_str = amounts_in_line[-1] if len(amounts_in_line) >= 1 else "0.00"
                    amt_str = amounts_in_line[-2] if len(amounts_in_line) >= 2 else "0.00"

                    # Extraction logic for particulars
                    particulars_list = []
                    for p in parts[1:]:
                        if re.search(amount_pattern, p): break
                        particulars_list.append(p)
                    
                    current_particulars = " ".join(particulars_list)

                    if pre_buffer:
                        current_particulars = " ".join(pre_buffer) + " -pre " + current_particulars
                        pre_buffer = []

                    curr_bal_float = clean_currency(bal_str)
                    mode = "credited" if curr_bal_float > last_balance else "debited"
                    last_balance = curr_bal_float

                    current_tx = {
                        "date": parts[0],
                        "particulars": current_particulars,
                        "amount": amt_str,
                        "balance": bal_str,
                        "mode": mode
                    }
                else:
                    if current_tx:
                        if line.endswith('/'):
                            current_tx["particulars"] += " -pst " + line
                        else:
                            if "-pst" in current_tx["particulars"]:
                                pre_buffer.append(line)
                            else:
                                current_tx["particulars"] += " " + line
                    else:
                        pre_buffer.append(line)

        if current_tx: all_transactions.append(current_tx)

    sys.stdout.write(json.dumps(all_transactions))

if __name__ == "__main__":
    main()
