export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserRole {
  WIIQARE_ADMIN = 'WIIQARE_ADMIN',
  WIIQARE_MANAGER = 'WIIQARE_MANAGER',
  PAYER = 'PAYER',
  PATIENT = 'PATIENT',
  PROVIDER = 'PROVIDER',
}

export enum UserType {
  PAYER = 'PAYER',
  PATIENT = 'PATIENT',
  PROVIDER = 'PROVIDER',
}

export enum VoucherStatus {
  CLAIMED = 'CLAIMED',
  UNCLAIMED = 'UNCLAIMED',
  BURNED = 'BURNED',
}

export enum InviteType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}
