export const _401 = {
  AUTH_INVALID_TOKEN: { code: 'AUTH_INVALID_TOKEN', message: 'Invalid JWToken' },
  AUTH_TOKEN_EXPIRED: { code: 'AUTH_TOKEN_EXPIRED', message: 'Provided JWToken is expired' },
  MALFORMED_TOKEN: { code: 'MALFORMED_TOKEN', message: 'Provided JwToken is malformed.' },
}

export const _404 = {
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', description: 'User not found!' }
}

export const _500 = {
  INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR', description: 'Something went Unexceptedly!' }
}

