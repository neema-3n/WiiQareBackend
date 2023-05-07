export const _400 = {
  MALFORMED_INPUTS_PROVIDED: {
    code: 'MALFORMED_INPUTS_PROVIDED',
    description: 'Some of provided data are missing or not allowed',
  },
  PASSWORD_MISMATCH: {
    code: 'PASSWORD_MISMATCH',
    description: 'Passwords do not match!',
  },
  EMAIL_REQUIRED: {
    code: 'EMAIL_REQUIRED',
    description: 'Email is required!',
  },
  PHONE_NUMBER_REQUIRED: {
    code: 'PHONE_NUMBER_REQUIRED',
    description: 'Phone number is required!',
  },
};

export const _401 = {
  AUTH_INVALID_TOKEN: {
    code: 'AUTH_INVALID_TOKEN',
    description: 'Invalid JWToken',
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED',
    description: 'Provided JWToken is expired',
  },
  MALFORMED_TOKEN: {
    code: 'MALFORMED_TOKEN',
    description: 'Provided JwToken is malformed.',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    description: 'Invalid credentials was provided',
  },
};

export const _403 = {
  EMAIL_VERIFICATION_REQUIRED: {
    code: 'EMAIL_VERIFICATION_REQUIRED',
    description: 'Email is not verified or verification expired!',
  },
  OTP_VERIFICATION_FAILED: {
    code: 'OTP_VERIFICATION_FAILED',
    description:
      'One time password verification failed, needs to verify again!',
  },
  USER_ACCOUNT_NOT_ACTIVE: {
    code: 'USER_ACCOUNT_NOT_ACTIVE',
    description: 'User account not active!',
  },
  USER_ACCOUNT_ALREADY_EXIST: {
    code: 'USER_ACCOUNT_ALREADY_EXIST',
    description: 'User account already exist!',
  },
  PATIENT_ALREADY_EXISTS: {
    code: 'PATIENT_ALREADY_EXISTS',
    description: 'Patient already registered!',
  },
  INVALID_RESET_TOKEN: {
    code: 'INVALID_RESET_TOKEN',
    description: 'Invalid reset token provided!',
  },
  INVALID_EMAIL_VERIFICATION_TOKEN: {
    code: 'INVALID_EMAIL_VERIFICATION_TOKEN',
    description: 'Invalid email verification token provided!',
  },
  ACCESS_NOT_ALLOWED: {
    code: 'ACCESS_NOT_ALLOWED',
    description: 'Access not allowed!',
  },
  ONLY_OWNER_CAN_SEND_VOUCHER: {
    code: 'ONLY_OWNER_CAN_SEND_VOUCHER',
    description: 'Only owner can send voucher!',
  },
};

export const _404 = {
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', description: 'User not found!' },
  PAYER_NOT_FOUND: {
    code: 'PAYER_NOT_FOUND',
    description: 'Expart not found!',
  },
  PATIENT_NOT_FOUND: {
    code: 'PATIENT_NOT_FOUND',
    description: 'Patient not found!',
  },
  INVALID_TRANSACTION_HASH: {
    code: 'INVALID_TRANSACTION_HASH',
    description: 'Invalid transaction hash provided!',
  },
};

export const _409 = {
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    description: 'User already registered!',
  },
};

export const _500 = {
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    description: 'Something went Unexpectedly!',
  },
};
