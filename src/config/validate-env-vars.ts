import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './dto/environment-variables.dto';

export function validateEnvVars(config: Record<string, unknown>) {
  const validationConfigs = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validationConfigs, {
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validationConfigs;
}
