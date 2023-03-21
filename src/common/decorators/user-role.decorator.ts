import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ROLES } from '../constants/constants';
import { UserRole } from '../constants/enums';

/**
 * Define allowed entities/roles to access the request where @Roles() decorator is used.
 * @returns { UserRole[] } List of Roles.
 */
export const Roles = (...roles: UserRole[]): CustomDecorator =>
  SetMetadata(ROLES, roles);
