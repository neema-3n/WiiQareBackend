import { ApiResponseOptions } from '@nestjs/swagger';

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
