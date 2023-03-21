import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../common/constants/constants';

export const transformPasswordToHash = ({ value: password }): string =>
  bcrypt.hashSync(password, SALT_ROUNDS);
