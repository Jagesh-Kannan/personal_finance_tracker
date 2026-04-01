import crypto from 'crypto';

// Secret key (must be 32 bytes for AES-256) - stored as hex string, converted to Buffer
const secretKey = Buffer.from("d24503bf468eed50ecf14a645dd1c6cde0d8a5a99f2c31039c6dcc36f38a6b6d", 'hex');
const iv = Buffer.from('8eff6b2cea1b3b8d38abdba38bc22387', 'hex'); // Initialization vector as Buffer

export function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted, secretKey: secretKey.toString('hex') };
}

export function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
