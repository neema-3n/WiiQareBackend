import { ApiResponseOptions } from '@nestjs/swagger';
import * as crypto from 'crypto';
import countryLookup from 'country-code-lookup';
import cc from 'currency-converter-lt';

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

export const randomSixDigit = (): string => {
  const randomNumber = Math.floor(Math.random() * 999999) + 1;
  const randomString = randomNumber.toString().padStart(6, '0');
  return randomString;
};

/**
 * This helper function generate random hex string for password reset
 *
 */
export const generateToken = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * This helper function returns a country name based on the country code
 * @param countryCode Country Code
 *
 */
export const getCountryNameFromCode = (countryCode: string) => {
  return countryLookup.byFips(countryCode)?.country;
};

/**
 * helper method used to return 0 or empty string if the field has a null, or the actual field value if it's not null
 */
export const getEmptyValueIfNull = (field, type: string): string | number => {
  if (type == 'string') {
    return field === null ? '' : field;
  }
  if (type == 'number') {
    return field === null ? 0 : field;
  }
};

//  Currency Converter
const _currencyConverter = new cc();
_currencyConverter.setupRatesCache({
  isRatesCaching: true,
  ratesCacheDuration: 3600, // (1 hour)
});

export const convertToCurrency = async (
  previousCurrency: string,
  amount: number,
  newCurrency: string,
) => {
  return amount === null
    ? 0
    : previousCurrency.toUpperCase() === newCurrency.toUpperCase()
    ? amount
    : parseFloat(
        (
          (await _currencyConverter
            .from(previousCurrency)
            .to(newCurrency)
            .amount(amount)
            .convert()) as number
        ).toFixed(2),
      );
};
