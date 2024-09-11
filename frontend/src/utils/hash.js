import crypto from 'crypto';

// **Registration**
// Generate a random salt
const salt = 'c777712b58979b550cddd804e670ef9430a7a9426cebc291d1858f9c29beb10eba552b18cdbb3950dede0ef8aa705828d271cf03ec8aed89d01b913fff5de3f1';

// Hash the password with the salt
const password = 'ompatil';
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

// Store 'salt' and 'hash' in the database

// **Login**
// Retrieve 'salt' and 'hash' from the database

// Hash the provided password with the stored salt
const providedPassword = 'ompatil';
const providedHash = crypto.pbkdf2Sync(providedPassword, salt, 100000, 64, 'sha512').toString('hex');

console.log("hashed password: ", hash);

// Compare the hashes
if (providedHash === hash) {
  console.log('Password is correct!');
} else {
  console.log('Password is incorrect.');
}
