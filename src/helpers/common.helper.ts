import { ApiResponseOptions } from '@nestjs/swagger';
import * as crypto from 'crypto';

export const logSuccess = (...data: any[]): void => console.log(`✓ ${data}`);
export const logInfo = (...data: any[]): void => console.info(`→ ${data}`);
export const logError = (...data: any[]): void =>
  console.log('\x1b[31m', `⛔︎ ${data}`);

export const http_statuses = (
  data: { code: string; description: string }[],
): ApiResponseOptions => {
  let joined = 'Error codes: ';

  data.map((item) => {
    joined += `${item.code} , `;
  });

  return { description: joined };
};

/**
 * Generate high entropy random six-digit number
 */
export const randomSixDigitNumber = (): number => {
  const randomBytes = crypto.randomBytes(3); // 3 bytes = 24 bits
  const randomNumber = randomBytes.readUIntBE(0, 3); // Read as unsigned 24-bit integer
  return randomNumber % 1000000; // Modulo to get 6 digits
};

/**
 * This helper function generate random hex string for password reset
 *
 */
export const generateRandomResetPasswordToken = (): string => {
  return crypto.randomBytes(16).toString('hex');
};
