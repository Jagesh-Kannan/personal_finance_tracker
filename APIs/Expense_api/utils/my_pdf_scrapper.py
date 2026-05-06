import sys, io, json, re, pdfplumber, pytesseract

def main():
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_transactions = []
    current_row = None
    last_balance = None
    
    date_regex = r'^(\d{2}-\d{2}-\d{4})'
    # Improved regex to handle commas and ensure it captures the full currency value
    amount_regex = r'(\d[\d,.]*\.\d{2})'

    custom_config = r'--psm 6 -c preserve_interword_spaces=1'

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            img = page.to_image(resolution=200).original
            text = pytesseract.image_to_string(img, config=custom_config)
            
            for line in text.split("\n"):
                line = line.strip()
                if not line or "Page" in line or "Total:" in line: continue
                
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
                    
                    # Find all valid currency strings
                    amounts = re.findall(amount_regex, remaining)
                    
                    if len(amounts) >= 2:
                        # Balance is ALWAYS the last one
                        balance_str = amounts[-1]
                        # Transaction amount is the one before the balance
                        tx_amount = amounts[-2]
                        
                        # Cut the particulars string before the transaction amount starts
                        amt_idx = remaining.find(tx_amount)
                        particulars = remaining[:amt_idx].strip()
                    else:
                        balance_str = amounts[-1] if amounts else "0.00"
                        tx_amount = "0.00"
                        particulars = remaining
                        for amt in amounts:
                            particulars = particulars.replace(amt, "").strip()

                    current_row = {
                        "date": tx_date,
                        "particulars": particulars,
                        "amount": tx_amount,
                        "balance": balance_str
                    }
                else:
                    if current_row:
                        # Append continuation text, removing any stray numbers
                        clean_cont = re.sub(amount_regex, "", line).strip()
                        if clean_cont:
                            current_row["particulars"] += " " + clean_cont

        if current_row: all_transactions.append(current_row)

    # Post-Processing
    final_data = []
    running_balance = last_balance

    for tx in all_transactions:
        try:
            # Convert to float for comparison (remove commas)
            clean_amt = float(tx['amount'].replace(',', ''))
            curr_bal = float(tx['balance'].replace(',', ''))
            
            # Recalculate mode based on balance shift
            if running_balance is not None:
                tx["mode"] = "credited" if curr_bal > running_balance else "debited"
            else:
                tx["mode"] = "debited"
            
            # Clean up the text
            tx["particulars"] = re.sub(r'\s{2,}', ' ', tx["particulars"]).strip()
            
            running_balance = curr_bal
            final_data.append(tx)
        except:
            continue

    sys.stdout.write(json.dumps(final_data))

if __name__ == "__main__":
    main()
