import sys, io, json, re, pdfplumber, pytesseract

def main():
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_transactions = []
    current_row = None
    last_balance = None
    
    date_regex = r'^(\d{2}-\d{2}-\d{4})'
    amount_regex = r'(\d{1,3}(?:,\d{2,3})*\.\d{2})'

    # THE MAGIC CONFIG: PSM 6 + Space Preservation
    custom_config = r'--psm 6 -c preserve_interword_spaces=1'

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            # 200 DPI is usually the sweet spot for Render's 512MB RAM
            img = page.to_image(resolution=200).original
            text = pytesseract.image_to_string(img, config=custom_config)
            
            for line in text.split("\n"):
                line = line.strip()
                if not line or "Page" in line or "Total:" in line: continue
                
                # Capture starting balance for mode (credited/debited) calculation
                if "B/F" in line:
                    amounts = re.findall(amount_regex, line)
                    if amounts: last_balance = float(amounts[-1].replace(',', ''))
                    continue

                date_match = re.match(date_regex, line)
                
                if date_match:
                    if current_row: all_transactions.append(current_row)
                    
                    transaction_date = date_match.group(1)
                    remaining = line[len(transaction_date):].strip()
                    amounts = re.findall(amount_regex, remaining)
                    
                    if amounts:
                        balance_str = amounts[-1]
                        # Capture balance position to split trailing text
                        balance_idx = remaining.rfind(balance_str)
                        
                        particulars_main = remaining[:balance_idx].strip()
                        # This captures headers of the NEXT tx that OCR merged into this line
                        next_tx_header = remaining[balance_idx + len(balance_str):].strip()

                        for amt in amounts:
                            particulars_main = particulars_main.replace(amt, "").strip()

                        current_row = {
                            "date": transaction_date,
                            "particulars": particulars_main,
                            "amount": amounts[-2] if len(amounts) >= 2 else amounts[0],
                            "balance": balance_str,
                            "next_tx_header": next_tx_header # Buffer for next row
                        }
                else:
                    if current_row:
                        # Prepend buffer from previous line if it exists
                        if current_row.get("next_tx_header"):
                            current_row["particulars"] += " " + current_row["next_tx_header"]
                            current_row["next_tx_header"] = ""
                        
                        clean_cont = re.sub(amount_regex, "", line).strip()
                        current_row["particulars"] += " " + clean_cont

        if current_row: all_transactions.append(current_row)

    # Process Credited/Debited Mode
    final_data = []
    running_balance = last_balance
    for tx in all_transactions:
        try:
            curr_bal = float(tx['balance'].replace(',', ''))
            tx["mode"] = "credited" if (running_balance and curr_bal > running_balance) else "debited"
            running_balance = curr_bal
            tx.pop("next_tx_header", None)
            final_data.append(tx)
        except: continue

    sys.stdout.write(json.dumps(final_data))

if __name__ == "__main__":
    main()
