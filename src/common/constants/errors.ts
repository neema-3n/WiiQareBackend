export const _400 = {
  MALFORMED_INPUTS_PROVIDED: {
    code: 'MALFORMED_INPUTS_PROVIDED',
    message: 'Some of provided data are missing or not allowed',
  },
};

export const _401 = {
  AUTH_INVALID_TOKEN: {
    code: 'AUTH_INVALID_TOKEN',
    message: 'Invalid JWToken',
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED',
    message: 'Provided JWToken is expired',
  },
  MALFORMED_TOKEN: {
    code: 'MALFORMED_TOKEN',
    message: 'Provided JwToken is malformed.',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid credentials was provided',
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
