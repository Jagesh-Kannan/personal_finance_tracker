import sys, io, json, re, pdfplumber, pytesseract

def main():
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_transactions = []
    current_row = None
    
    # Regex to identify a line starting with a date (DD-MM-YYYY)
    date_regex = r'^(\d{2}-\d{2}-\d{4})'
    # Regex to find currency amounts (e.g., 2,97,901.36)
    amount_regex = r'(\d{1,3}(?:,\d{2,3})*\.\d{2})'

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            img = page.to_image(resolution=200).original
            text = pytesseract.image_to_string(img, config='--psm 6')
            
            for line in text.split("\n"):
                line = line.strip()
                if not line or "Page" in line or "Total:" in line:
                    continue
                
                date_match = re.match(date_regex, line)
                
                if date_match:
                    # Save previous row before starting new one
                    if current_row:
                        all_transactions.append(current_row)
                    
                    transaction_date = date_match.group(1)
                    # Remove the date from the line to process the rest
                    remaining_text = line[len(transaction_date):].strip()
                    
                    # Find all amounts in this line
                    amounts = re.findall(amount_regex, remaining_text)
                    
                    # In ICICI format, the last amount is ALWAYS the Balance
                    balance = amounts[-1] if len(amounts) >= 1 else ""
                    
                    # If there are 3 amounts: [Deposit/Withdrawal, (ignored), Balance]
                    # If there are 2 amounts: [Withdrawal, Balance]
                    # We'll extract them from the end of the amounts list
                    val1 = amounts[-2] if len(amounts) >= 2 else ""
                    
                    # Clean the particulars by removing the extracted amounts from the string
                    particulars = remaining_text
                    for amt in amounts:
                        particulars = particulars.replace(amt, "").strip()

                    current_row = {
                        "date": transaction_date,
                        "particulars": particulars,
                        "amount": val1, # This is the transaction value
                        "balance": balance
                    }
                else:
                    # If no date, this is a continuation of the particulars
                    if current_row:
                        # Remove any stray amounts that might have been picked up in wrapped text
                        clean_continuation = re.sub(amount_regex, "", line).strip()
                        current_row["particulars"] += " " + clean_continuation

        if current_row:
            all_transactions.append(current_row)

    # Final cleanup: Remove the 'B/F' row as it's not a transaction
    final_data = [tx for tx in all_transactions if "B/F" not in tx['particulars']]

    sys.stdout.write(json.dumps(final_data))

if __name__ == "__main__":
    main()
