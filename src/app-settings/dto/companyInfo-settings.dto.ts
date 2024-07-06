import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl, ValidateNested } from "class-validator";

export class SocialProfileDto {
    @ApiProperty({ type: String, example: 'Facebook url' })
    @IsString()
    @IsNotEmpty()
    platform: string;

    @ApiProperty({ type: String, example: 'https://facebook.com' })
    @IsNotEmpty()
    @IsUrl()
    url: string;
}

export class CompanyInfoSettingsDto {
    @ApiProperty({ type: String, description: 'City' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    city?: string;

    @ApiProperty({ type: String, description: 'Address line 1' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    addressLine1: string;

    @ApiProperty({ type: String, description: 'Address line 2' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    addressLine2: string;

    @ApiPropertyOptional({ type: String, description: 'Street Address' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    streetAddress?: string;

    @ApiPropertyOptional({ type: String, description: 'Emirate' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    emirate?: string;

    @ApiPropertyOptional({ type: String, description: 'PO Box' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    poBox?: string;

    @ApiPropertyOptional({ type: String, description: 'Phone no.' })
    @IsPhoneNumber('AE', { message: 'Invalid phone number. Must be a valid UAE phone number' })
    @IsNotEmpty()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ type: String, description: 'Alternate phone no.' })
    @IsPhoneNumber('AE', { message: 'Invalid phone number. Must be a valid UAE phone number' })
    @IsNotEmpty()
    @IsOptional()
    alternatePhone?: string;

    @ApiPropertyOptional({ type: String, description: 'Company Email' })
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ type: String, description: 'Company Website' })
    @IsUrl()
    @IsNotEmpty()
    @IsOptional()
    website?: string;

    @ApiPropertyOptional({ type: [SocialProfileDto] })
    @IsArray()
    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => SocialProfileDto)
    @IsOptional()
    socialProfiles?: SocialProfileDto[];
}
