import crypto from 'crypto';
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const LENGTH = 3;

/**
 * This function generates a random attribute code.
 * @returns {string}
 */
export function generateAttributeCode(): string {
    let result = '';
    const bytes = crypto.randomBytes(LENGTH);

    for (let i = 0; i < LENGTH; i++) {
        const randomIndex = bytes[i] % charset.length;
        result += charset[randomIndex];
    }

    return result;
}