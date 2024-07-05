import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAttributeOptionDto {
    @ApiProperty({ type: String, description: 'Attribute option value' })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({ type: String, description: 'Attribute option meta' })
    @IsString()
    @IsNotEmpty()
    meta: string;

    @ApiProperty({ type: String, format: 'uuid', description: 'Attribute id' })
    @IsUUID()
    @IsNotEmpty()
    attributeId: string;
}
