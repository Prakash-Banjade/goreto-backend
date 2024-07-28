import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { IsUrlOrFile } from 'src/core/decorators/IsUrlOrFile.decorator';
import { Gender } from 'src/core/types/global.types';

export class UpdateUserDto {
    @ApiPropertyOptional({ type: 'string', description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    @Length(2)
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional({ type: 'string', description: 'Last name of the user' })
    @IsString()
    @Length(2)
    @IsOptional()
    lastName?: string = '';

    @ApiPropertyOptional({ type: 'string', format: 'email', description: 'Valid email' })
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ type: 'string', description: 'A valid UAE based phone number' })
    @IsPhoneNumber('AE')
    @IsOptional()
    phone?: string

    @ApiPropertyOptional({ type: 'enum', enum: Gender, enumName: 'Gender' })
    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender

    @ApiPropertyOptional({ type: 'string', format: 'date-time', description: 'Date of Birth' })
    @IsDateString({ strict: true })
    @IsOptional()
    dob?: string
}

export class UpdateProfileImageDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Profile Image' })
    @IsUrlOrFile()
    image?: FileSystemStoredFile | string
}
