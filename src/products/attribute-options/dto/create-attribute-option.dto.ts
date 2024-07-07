import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateAttributeOptionDto {
    @ApiProperty({ type: String, description: 'Attribute option value' })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiPropertyOptional({ type: String, description: 'Attribute option meta' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    meta?: string;

    @ApiProperty({ type: String, format: 'uuid', description: 'Attribute id' })
    @IsUUID()
    @IsNotEmpty()
    attributeId: string;
}
