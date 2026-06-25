/**
 * Simple, synchronous encryption utility simulating secure storage (AES-256)
 * for dog walking diaries to protect privacy inside the database.
 */
const SECRET_KEY = 'munggo-secret-encryption-key-for-diary-timelines';

/**
 * Encrypts plain text using a key-based XOR-Base64 algorithm.
 * @param text The plain text to encrypt.
 * @returns The base64-encoded encrypted string.
 */
export function encryptText(text: string): string {
  if (!text) return '';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    result += String.fromCharCode(charCode ^ keyChar);
  }
  return btoa(encodeURIComponent(result));
}

/**
 * Decrypts encrypted text back to its original plain text.
 * @param encryptedText The base64-encoded encrypted string.
 * @returns The decrypted plain text.
 */
export function decryptText(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const decoded = decodeURIComponent(atob(encryptedText));
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return result;
  } catch (e) {
    console.error('Failed to decrypt text, returning source:', e);
    return encryptedText;
  }
}
