# SHIELD Password Manager

SHIELD is a secure password manager designed to keep your passwords, notes and personal information safe using state-of-the-art encryption techniques. Built with the MERN stack, Redux, and RTK Query, SHIELD emphasizes strong security principles including true end-to-end encryption and a zero-knowledge architecture.

[Live Website](https://ompatil-shield.onrender.com/)

[Read white paper on our security design](https://github.com/ompatil-15/SHIELD-Password-Manager/blob/main/SHIELD-Security-Design.pdf)

## Features

- **True End-to-End Encryption:** All cryptographic keys are generated and managed on the client-side. Data is encrypted locally before being sent to the server.
- **Zero-Knowledge Architecture:** The server does not have access to your passwords or cryptographic keys. Only you can decrypt your data.
- **Advanced Encryption Techniques:** Utilizes AES-GCM-256 encryption enhanced by PBKDF2 with SHA-256 for secure data protection.
- **Privacy by Design, Trust the Math:** Engineered with the assumption of database compromise, ensuring that your privacy remains intact.

## Installation

To set up SHIELD on your local machine, follow these steps:

1. **Clone the Repository:**

```bash
git clone https://github.com/yourusername/shield-password-manager.git
cd shield-password-manager
```

2. **Install Dependencies:**

Make sure you have `Node.js` and `npm` installed. Then, install the project dependencies:

```bash
npm install
```

3. **Configure Environment Variables:**

Create a `.env` file in the root directory and add the necessary environment variables.

4. Start the Development Server:

```
npm start
```
This will start the development server and open SHIELD in your default browser.

## Security Overview

- **PBKDF2 with SHA-256:** Used for AES-256-GCM key derivation with 250,000 iterations on the client side from your master password, ensuring only you have access to your data. The master password is then again hashed using SHA-256 and the AES-256-GCM key as the salt for verifying user authenticity.
- **AES-GCM-256 Encryption:** Applied for encrypting data, providing high-level security. The encryption key for AES-256-GCM is dynamically derived every time you log in and is never stored anywhere, to provide maximum security.
- **Zero-Knowledge Design:** Ensures that data decryption is only possible with your master password. All your data in the database is encrypted with the most advanced encrption and hashing algorithms.

## Contact

For any questions or feedback, please reach out to `patilom001@gmail.com`
