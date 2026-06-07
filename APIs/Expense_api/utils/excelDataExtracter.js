import * as XLSX from 'xlsx';

// Helper to handle the parsing logic
export const extractExcelData = (fileBuffer) => {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const rawData = XLSX.utils.sheet_to_json(sheet, { defval: null });
    
    // Your existing table identification logic
    const transactions = extractTransactionTable(rawData);

    return transactions.map(row => {
        const remark = row['__EMPTY_5'] || '';
        const parts = remark.split('/');
        
        const modeOfTxn = parts[0] || '';
        const receiverName = parts[1] || '';
        const userNote = parts[3] || '';

        const withdrawal = parseFloat(row['__EMPTY_6']) || 0;
        const deposit = parseFloat(row['__EMPTY_7']) || 0;

        if (withdrawal === 0 && deposit === 0) return null;

        const amount = withdrawal > 0 ? withdrawal : deposit;
        const mode = withdrawal > 0 ? 'DEBITED' : 'CREDITED';

        return {
            expenseName: `${userNote} ${modeOfTxn}`.trim() || "Unknown Transaction",
            expenseCategory: userNote || 'UN-CATEGORIZED',
            amount,
            paymentMode: getPaymentMode(modeOfTxn), // Assumes this helper exists
            mode,
            transactionDate: parseExcelDate(row['__EMPTY_3']), // Assumes this helper exists
            notes: remark,
            currency: 'INR',
            senderOrReceiver: receiverName,
            customGrouping: receiverName
        };
    }).filter(item => item !== null);
};


/**
 * Extracts only the transaction table rows from the raw Excel JSON
 * @param {Array} rawData - JSON array from xlsx.utils.sheet_to_json
 * @returns {Array} Cleaned transaction rows
 */
export function extractTransactionTable(rawData) {
  // Find the index of the header row
  const headerIndex = rawData.findIndex(
    row =>
      row['__EMPTY_1'] === 'S No.' &&
      row['__EMPTY_2'] === 'Value Date' &&
      row['__EMPTY_3'] === 'Transaction Date'
  );

  if (headerIndex === -1) {
    throw new Error('Table structure error: header row not found');
  }

  // Slice everything after the header
  const tableData = rawData.slice(headerIndex + 1);

  // Stop when "Legends Used in Account Statement" appears
  const legendsIndex = tableData.findIndex(
    row => row['__EMPTY_1'] === 'Legends Used in Account Statement'
  );

  const trimmedData =
    legendsIndex !== -1 ? tableData.slice(0, legendsIndex) : tableData;

  return trimmedData;
}


/**
 * Utility: map transaction mode string to paymentMode enum
 */
function getPaymentMode(modeStr) {
  const upper = modeStr.toUpperCase();
  if (upper.includes('UPI')) return 'UPI';
  if (/(INFT|INF|NEFT|IMPS|MMT|EBF|PAYC)/.test(upper)) return 'BANK_TRANSFER';
  if (upper.includes('PAVC')) return 'CREDIT_CARD';
  if (/(VPS|IPS)/.test(upper)) return 'DEBIT_CARD';
  if (upper.includes('CMS')) return 'CHEQUE';
  if (/(CCWD|CWD|VAT|MAT|NFS)/.test(upper)) return 'CASH';
  return 'BANK_TRANSFER'; // default fallback
}

/**
 * Parse Excel numeric date like 1042026 into ISO string
 * Format assumption: DDMMYYYY (no separators)
 */
function parseExcelDate(num) {
  if (!num) return null;
  const pureDigits = String(num).replace(/[^0-9]/g, '');
  const str = pureDigits.padStart(8, '0'); // ensure 8 digits
  const day = str.slice(0, 2);
  const month = str.slice(2, 4);
  const year = str.slice(4);

  // Construct proper date
  const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  return isoDate.toISOString();
}
