import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    isString,
} from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
const backendUrl = process.env.BACKEND_URL

@ValidatorConstraint({ async: false })
class IsUrlOrFileConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        if (value instanceof FileSystemStoredFile) {
            return validImageTypes.includes(value.mimetype);
        }

        return isString(value) && value?.startsWith(backendUrl);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a url or a file of type ${validImageTypes}`;
    }
}

export function IsUrlOrFile(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsUrlOrFileConstraint,
        });
    };
}
