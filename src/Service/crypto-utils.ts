import * as CryptoJS from "crypto-js";

// The salt key used in key derivation
const SALT_KEY = "yourSaltKey";

// Derive a key from the passphrase and salt using PBKDF2
const deriveKey = (passphrase: string, salt: string) => {
  const key = CryptoJS.PBKDF2(passphrase, salt, {
    keySize: 256 / 32,
    iterations: 100000,
  });
  return key;
};

// Encrypt the password using AES
export function encryptPassword(password, passphrase, salt) {
    const key = deriveKey(passphrase, salt);
    const iv  = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(
      password,
      key,
      { iv }
    );
    return {
      iv: iv.toString(CryptoJS.enc.Base64),
      data: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    };
  }
  
  export function decryptPassword({ iv, data }, passphrase, salt) {
    const key = deriveKey(passphrase, salt);
    const ivWA = CryptoJS.enc.Base64.parse(iv);
    const ct   = CryptoJS.enc.Base64.parse(data);
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ct },
      key,
      { iv: ivWA }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

