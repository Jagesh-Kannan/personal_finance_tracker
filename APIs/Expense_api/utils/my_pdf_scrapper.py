import sys, io, json, re, pdfplumber, pytesseract

def clean_currency(val):
    if not val: return 0.0
    # Removes everything but digits to handle messy OCR comma/dot confusion
    digits = re.sub(r'[^0-9]', '', val)
    if len(digits) > 2:
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
    
    # Patterns
    date_pattern = r'^\d{2}-\d{2}-\d{4}'
    amount_pattern = r'[\d,.]+\.\d{2}'
    # ICICI Keywords that trigger a "Next Transaction" logic if they start a line
    kw_pattern = r'^(UPI|NEFT|CMS|ACH|RTGS|IMPS|MMT|INF|INFT|BIL|BPAY)'

    custom_config = r'--psm 6 -c preserve_interword_spaces=1'

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            img = page.to_image(resolution=200).original
            text = pytesseract.image_to_string(img, config=custom_config)
            
            for line in text.split("\n"):
                line = line.strip()
                if not line: continue

                # Detect Table Context
                if "DATE" in line and "PARTICULARS" in line:
                    table_started = True; continue
                if "Total:" in line:
                    table_started = False; continue
                if not table_started: continue

                parts = line.split()
                is_date = re.match(date_pattern, parts[0]) if parts else False
                is_keyword_start = re.match(kw_pattern, line, re.IGNORECASE)

                # Capture starting balance
                if is_date and "B/F" in line:
                    amounts = re.findall(amount_pattern, line)
                    if amounts: last_balance = clean_currency(amounts[-1])
                    continue

                # NEW ROW TRIGGER: Date found
                if is_date:
                    if current_tx: all_transactions.append(current_tx)

                    amounts_in_line = re.findall(amount_pattern, line)
                    bal_str = amounts_in_line[-1] if len(amounts_in_line) >= 1 else "0.00"
                    amt_str = amounts_in_line[-2] if len(amounts_in_line) >= 2 else "0.00"

                    # Build particulars from current line words that aren't amounts
                    particulars_list = []
                    for p in parts[1:]:
                        if re.search(amount_pattern, p): break
                        particulars_list.append(p)
                    
                    current_particulars = " ".join(particulars_list)

                    # Prepend pre_buffer (from previous pst logic or keyword detection)
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

                # CONTINUATION OR BUFFER TRIGGER
                else:
                    if current_tx:
                        # KEYWORD LOGIC: If line starts with UPI/NEFT etc., it belongs to NEXT tx
                        if is_keyword_start:
                            pre_buffer.append(line)
                        # -pst LOGIC: If line ends with /, it belongs to CURRENT tx as post-text
                        elif line.endswith('/'):
                            current_tx["particulars"] += " -pst " + line
                        else:
                            # Standard continuation
                            if pre_buffer: # If we are already buffering for next, keep buffering
                                pre_buffer.append(line)
                            else:
                                current_tx["particulars"] += " " + line
                    else:
                        pre_buffer.append(line)

        if current_tx: all_transactions.append(current_tx)

    sys.stdout.write(json.dumps(all_transactions))

if __name__ == "__main__":
    main()
