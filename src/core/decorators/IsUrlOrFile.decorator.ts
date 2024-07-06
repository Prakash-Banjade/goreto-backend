import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    isURL,
} from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

@ValidatorConstraint({ async: false })
class IsUrlOrFileConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        if (value instanceof FileSystemStoredFile) {
            return validImageTypes.includes(value.mimetype);
        }

        return isURL(value);
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
