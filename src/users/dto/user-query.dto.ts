import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { Country } from "src/core/types/country.type";
import { Gender } from "src/core/types/global.types";

export class UserQueryDto extends QueryDto {

    @ApiPropertyOptional({ type: 'string', required: false })
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ type: 'enum', enum: Gender })
    @IsOptional()
    gender?: Gender;

    @ApiPropertyOptional({ type: 'string', required: false })
    @IsOptional()
    dob?: string;

    
    @ApiPropertyOptional({ type: String, description: 'Address 1' })
    @IsString()
    @IsOptional()
    address1?: string;

    @ApiPropertyOptional({ type: String, description: 'Address 2' })
    @IsString()
    @IsOptional()
    address2?: string;

    @ApiPropertyOptional({ type: String, description: 'City' })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiPropertyOptional({ type: 'enum', enum: Country, description: 'Country' })
    @IsOptional()
    country?: string;

    @ApiPropertyOptional({ type: String, description: 'Province' })
    @IsString()
    @IsOptional()
    province?: string;

    @ApiPropertyOptional({ type: Number, description: 'Zip Code' })
    @IsOptional()
    zipCode?: number;
}