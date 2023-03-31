import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

//TODO: fix this later!!
export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          const phoneNumber = phoneNumberUtil.parse(value);
          const regionCode =
            phoneNumberUtil.getRegionCodeForNumber(phoneNumber);
          return (
            regionCode === 'CD' || regionCode === 'CM' || regionCode === 'SN'
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not a valid phone number for DRC, Cameroon, or Senegal`;
        },
      },
    });
  };
}
