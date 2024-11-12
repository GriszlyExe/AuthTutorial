// import speakeasy from 'speakeasy';
// import QRCode from 'qrcode';

import { googleVerification } from "@/action/action";

// Function to generate a TOTP secret and QR code
async function generateTotpSecret(userEmail: string) {
    // Generate a secret key for the user
    const speakeasy = require('speakeasy');
    const QRCode = require('qrcode');

    const secret = speakeasy.generateSecret({ length: 20 });

    // Generate a provisioning URI for the QR code
    const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: `"FakeFlix":${userEmail}`,
        issuer: "FakeFlix",
        encoding: "base32",
    });

    // console.log("Secret (Store this securely):", secret.base32);

    // Generate the QR code from the provisioning URI
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // console.log("QR Code Data URL:\n", qrCodeDataUrl);
    return { secret: secret.base32,  qrCodeDataUrl};
}

// Usage example
// console.log("start")
// generateTotpSecret("user@example.com")
//     .then((data) => {
//         console.log("Secret Key:", data.secret);
//         console.log("QR Code URL (for display):",data.qrCodeDataUrl);
//     })
//     .catch((error) => console.error("Error generating TOTP secret and QR code:", error));

const ans = googleVerification("grillmon01234@gmail.com","420500")

console.log(ans)
