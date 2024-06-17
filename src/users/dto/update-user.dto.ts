import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { Gender } from 'src/core/types/global.types';

export class UpdateUserDto {
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

    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Profile Image' })
    @IsString()
    @IsOptional()
    image?: string | FileSystemStoredFile
}
