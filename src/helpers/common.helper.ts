export const logSuccess = (...data: any[]): void => console.log(`✓ ${data}`);
export const logInfo = (...data: any[]): void => console.info(`→ ${data}`);
export const logError = (...data: any[]): void => console.log('\x1b[31m', `⛔︎ ${data}`);
