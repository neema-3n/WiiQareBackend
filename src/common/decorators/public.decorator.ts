import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { IS_PUBLIC } from '../constants/constants';

/**
 * Custom decorator to whitelist non-protected/public APIs.
 * @returns { boolean } if the decorator used return true
 */
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC, true);
