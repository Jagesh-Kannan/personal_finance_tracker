import sys, io, json, re, pdfplumber, pytesseract

def main():
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_transactions = []
    current_row = None
    last_balance = None
    
    # Matches DD-MM-YYYY
    date_regex = r'^(\d{2}-\d{2}-\d{4})'
    # Matches numbers like 1,234.56 or 123.00
    amount_regex = r'(\d{1,3}(?:,\d{2,3})*\.\d{2})'

    # PSM 6 keeps the horizontal line intact
    custom_config = r'--psm 6 -c preserve_interword_spaces=1'

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            img = page.to_image(resolution=200).original
            text = pytesseract.image_to_string(img, config=custom_config)
            
            for line in text.split("\n"):
                line = line.strip()
                if not line or "Page" in line or "Total:" in line: continue
                
                # Capture starting balance from B/F line
                if "B/F" in line:
                    amounts = re.findall(amount_regex, line)
                    if amounts: 
                        last_balance = float(amounts[-1].replace(',', ''))
                    continue

                date_match = re.match(date_regex, line)
                
                if date_match:
                    if current_row: all_transactions.append(current_row)
                    
                    tx_date = date_match.group(1)
                    remaining = line[len(tx_date):].strip()
                    
                    # Find all amounts (usually [TransactionAmount, Balance])
                    amounts = re.findall(amount_regex, remaining)
                    
                    if len(amounts) >= 2:
                        balance_str = amounts[-1]
                        tx_amount = amounts[-2]
                        # Everything between the date and the first amount is particulars
                        # We find where the first amount starts to cut the string
                        first_amt_idx = remaining.find(tx_amount)
                        particulars = remaining[:first_amt_idx].strip()
                    else:
                        # Fallback if OCR missed one of the numbers
                        balance_str = amounts[-1] if amounts else "0.00"
                        tx_amount = "0.00"
                        particulars = re.sub(amount_regex, "", remaining).strip()

                    current_row = {
                        "date": tx_date,
                        "particulars": particulars,
                        "amount": tx_amount,
                        "balance": balance_str
                    }
                else:
                    # This is a continuation line (no date at start)
                    if current_row:
                        # Clean any stray numbers from the description continuation
                        clean_cont = re.sub(amount_regex, "", line).strip()
                        if clean_cont:
                            current_row["particulars"] += " " + clean_cont

        if current_row: all_transactions.append(current_row)

    # Final Post-Processing for Mode and Cleanup
    final_data = []
    running_balance = last_balance

    for tx in all_transactions:
        try:
            # Clean up the particulars (remove multiple spaces)
            tx["particulars"] = re.sub(r'\s{2,}', ' ', tx["particulars"]).strip()
            
            # Determine Mode
            curr_bal = float(tx['balance'].replace(',', ''))
            if running_balance is not None:
                tx["mode"] = "credited" if curr_bal > running_balance else "debited"
            else:
                tx["mode"] = "debited"
            
            running_balance = curr_bal
            final_data.append(tx)
        except:
            continue

    sys.stdout.write(json.dumps(final_data))

if __name__ == "__main__":
    main()
