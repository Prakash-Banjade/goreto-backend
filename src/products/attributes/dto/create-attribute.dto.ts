import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray } from 'class-validator';


class CreateAttributeOptionDto {
    @ApiProperty({ type: String, description: 'Attribute option value' })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({ type: String, description: 'Attribute option meta' })
    @IsString()
    @IsNotEmpty()
    meta: string;
}

export class CreateAttributeDto {
    @ApiProperty({ type: String, description: 'Attribute name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: String, description: 'Attribute code', example: 'D, S' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    code?: string;

    @ApiPropertyOptional({ type: [CreateAttributeOptionDto], description: 'Attribute options' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAttributeOptionDto)
    @IsOptional()
    options?: CreateAttributeOptionDto[]
}
