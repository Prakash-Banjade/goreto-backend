import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Country } from "src/core/types/country.type";

export class CreateAddressDto {
    @ApiProperty({ type: String, description: 'Address 1' })
    @IsString()
    @IsNotEmpty()
    address1!: string;

    @ApiPropertyOptional({ type: String, description: 'Address 2' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address2?: string;

    @ApiProperty({ type: String, description: 'City' })
    @IsString()
    @IsNotEmpty()
    city!: string;

    @ApiProperty({ type: 'enum', enum: Country, description: 'Country' })
    @IsEnum(Country)
    country!: Country;

    @ApiProperty({ type: String, description: 'Province' })
    @IsString()
    @IsNotEmpty()
    province!: string;

    @ApiProperty({ type: Number, description: 'Zip Code' })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Zip code must be a number');
        return parseInt(value)
    })
    zipCode!: number;
}
