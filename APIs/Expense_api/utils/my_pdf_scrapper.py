import sys, io, json, pdfplumber, pytesseract
import pandas as pd

def main():
    input_bytes = sys.stdin.buffer.read()
    if not input_bytes: sys.exit(1)

    all_pages_raw = []
    
    # PSM 6 is essential for keeping rows horizontally aligned
    custom_config = r'--psm 6 -c preserve_interword_spaces=1'

    with pdfplumber.open(io.BytesIO(input_bytes)) as pdf:
        for page in pdf.pages:
            # High-res image conversion
            img = page.to_image(resolution=200).original
            
            # Get detailed data (coordinates, text, line numbers)
            data = pytesseract.image_to_data(img, config=custom_config, output_type=pytesseract.Output.DICT)
            
            df = pd.DataFrame(data)
            
            # 1. Filter out low-confidence or empty results
            df = df[df['text'].str.strip() != ""]
            
            # 2. Group by 'block_num' and 'line_num' 
            # This identifies words that belong to the same physical line on the page
            lines = df.groupby(['block_num', 'line_num'])['text'].apply(lambda x: ' '.join(x)).reset_index()
            
            for _, row in lines.iterrows():
                line_text = row['text'].strip()
                
                # Skip headers and empty lines
                if not line_text or "Page" in line_text or "Visit" in line_text:
                    continue
                
                all_pages_raw.append(line_text)

    # Return the raw lines as a flat array
    sys.stdout.write(json.dumps(all_pages_raw))

if __name__ == "__main__":
    main()
