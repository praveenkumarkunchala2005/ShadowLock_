const strToBuf = str => new TextEncoder().encode(str);
const bufToBase64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const base64ToBuf = b64 => {
  try {
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  } catch (e) {
    console.error("Invalid Base64 input:", b64);
    throw new Error("Invalid Base64 string");
  }
};

async function deriveKey(KEY1, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', strToBuf(KEY1), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(plaintext, KEY1) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await deriveKey(KEY1, salt);
  
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      strToBuf(plaintext)
    );
  
    const encryptedBase64 = [
      bufToBase64(salt),
      bufToBase64(iv),
      bufToBase64(encrypted)
    ].join(':');
  
    console.log("Encrypted string:", encryptedBase64);
    return encryptedBase64;
  }
  

export async function decrypt(encryptedStr, KEY1) {
    if (encryptedStr.split(':').length === 3) {
        console.log("Decrypted password:", encryptedStr);
      } else {
        console.error("Invalid encrypted string format:", encryptedStr);
      }
  const [saltB64, ivB64, ctB64] = encryptedStr.split(':');
  if (!saltB64 || !ivB64 || !ctB64) {
    console.error("Invalid encrypted string format:", encryptedStr);
    throw new Error("Invalid encrypted string format");
  }

  const salt = base64ToBuf(saltB64);
  const iv = base64ToBuf(ivB64);
  const ct = base64ToBuf(ctB64);

  const aesKey = await deriveKey(KEY1, salt);
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      ct
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("Decryption failed:", e);
    throw new Error("Decryption failed");
  }
}
