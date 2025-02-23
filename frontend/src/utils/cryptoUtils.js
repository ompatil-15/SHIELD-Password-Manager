// Utility functions
const Uint8ArrayToBase64 = (data) => {
    if (!(data instanceof Uint8Array)) {
        throw new TypeError('Input must be a Uint8Array');
    }
    const binaryString = String.fromCharCode(...data);
    return btoa(binaryString);
};

const Base64ToUint8Array = (base64) => {
    if (typeof base64 !== 'string') {
        throw new TypeError('Input must be a Base64 string');
    }
    try {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    } catch (error) {
        throw new Error('Invalid Base64 string: ' + error.message);
    }
};

// Generate random salt for SHA-256 (returns Base64)
const generateRandomSaltBase64 = () => {
    if (!window.crypto || !window.crypto.getRandomValues) {
        throw new Error('Cryptographically secure random number generation not supported');
    }
    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt);
    return Uint8ArrayToBase64(salt);
};

// Generate random IV for AES-GCM (returns Base64)
const generateRandomIVBase64 = () => {
    if (!window.crypto || !window.crypto.getRandomValues) {
        throw new Error('Cryptographically secure random number generation not supported');
    }
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);
    return Uint8ArrayToBase64(iv);
};

// Derive AES-GCM key using password and salt (takes Base64, returns Base64)
const deriveKeyBase64 = async (passwordBase64, saltBase64) => {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API not supported in this environment');
    }
    try {
        const passwordBytes = Base64ToUint8Array(passwordBase64);
        const saltBytes = Base64ToUint8Array(saltBase64);
        const passwordKey = await window.crypto.subtle.importKey(
            "raw",
            passwordBytes,
            "PBKDF2",
            false,
            ["deriveKey"]
        );
        const derivedKey = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: saltBytes,
                iterations: 250000,
                hash: { name: "SHA-256" },
            },
            passwordKey,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        // Export the derived key as Base64
        const rawKey = await window.crypto.subtle.exportKey("raw", derivedKey);
        return Uint8ArrayToBase64(new Uint8Array(rawKey));
    } catch (error) {
        throw new Error('Failed to derive key: ' + error.message);
    }
};

// Hash password using AES key and salt (takes Base64, returns Base64)
const hashPasswordWithAesKeyAsSaltBase64 = async (passwordBase64, saltBase64) => {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API not supported in this environment');
    }
    try {
        const passwordBytes = Base64ToUint8Array(passwordBase64);
        const aesKeyBase64 = await deriveKeyBase64(passwordBase64, saltBase64);
        const aesKeyBytes = Base64ToUint8Array(aesKeyBase64);

        // Concatenate AES key and password
        const passwordWithSalt = new Uint8Array([...aesKeyBytes, ...passwordBytes]);
        const digestArrayBuffer = await window.crypto.subtle.digest("SHA-256", passwordWithSalt);
        const digest = new Uint8Array(digestArrayBuffer);

        return Uint8ArrayToBase64(digest);
    } catch (error) {
        throw new Error('Failed to hash password: ' + error.message);
    }
};

// Create a combined Base64 package from Base64 inputs
const createPackageBase64 = (...base64Arrays) => {
    if (!base64Arrays.every(arr => typeof arr === 'string')) {
        throw new TypeError('All inputs must be Base64 strings');
    }
    try {
        const byteArrays = base64Arrays.map(Base64ToUint8Array);
        const totalLength = byteArrays.reduce((sum, arr) => sum + arr.length, 0);

        const combined = new Uint8Array(totalLength);
        let offset = 0;

        for (const arr of byteArrays) {
            combined.set(arr, offset);
            offset += arr.length;
        }

        return Uint8ArrayToBase64(combined);
    } catch (error) {
        throw new Error('Failed to create package: ' + error.message);
    }
};

// Create an encrypted package (returns Base64)
const createEncryptedPackageBase64 = async (passwordBase64) => {
    try {
        const saltBase64 = generateRandomSaltBase64();
        const IVBase64 = generateRandomIVBase64();
        const hashBase64 = await hashPasswordWithAesKeyAsSaltBase64(passwordBase64, saltBase64);
        return createPackageBase64(saltBase64, IVBase64, hashBase64);
    } catch (error) {
        throw new Error('Failed to create encrypted package: ' + error.message);
    }
};

// Encrypt data using AES-GCM (takes Base64 inputs, returns Base64)
const encryptDataBase64 = async (dataBase64, aesKeyBase64, ivBase64) => {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API not supported in this environment');
    }
    try {
        const dataBytes = Base64ToUint8Array(dataBase64);
        const aesKeyBytes = Base64ToUint8Array(aesKeyBase64);
        const ivBytes = Base64ToUint8Array(ivBase64);

        const aesKey = await window.crypto.subtle.importKey(
            "raw",
            aesKeyBytes,
            "AES-GCM",
            false,
            ["encrypt"]
        );

        const encryptedData = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: ivBytes },
            aesKey,
            dataBytes
        );

        return Uint8ArrayToBase64(new Uint8Array(encryptedData));
    } catch (error) {
        throw new Error('Failed to encrypt data: ' + error.message);
    }
};

// Decrypt data using AES-GCM (takes Base64 inputs, returns Base64)
const decryptDataBase64 = async (encryptedBase64, aesKeyBase64, ivBase64) => {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API not supported in this environment');
    }
    try {
        const encryptedBytes = Base64ToUint8Array(encryptedBase64);
        const aesKeyBytes = Base64ToUint8Array(aesKeyBase64);
        const ivBytes = Base64ToUint8Array(ivBase64);

        const aesKey = await window.crypto.subtle.importKey(
            "raw",
            aesKeyBytes,
            "AES-GCM",
            false,
            ["decrypt"]
        );

        const decryptedData = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivBytes },
            aesKey,
            encryptedBytes
        );

        return Uint8ArrayToBase64(new Uint8Array(decryptedData));
    } catch (error) {
        throw new Error('Failed to decrypt data: ' + error.message);
    }
};

export {
    Uint8ArrayToBase64,
    Base64ToUint8Array,
    generateRandomSaltBase64,
    generateRandomIVBase64,
    deriveKeyBase64,
    hashPasswordWithAesKeyAsSaltBase64,
    createPackageBase64,
    createEncryptedPackageBase64,
    encryptDataBase64,
    decryptDataBase64
};
