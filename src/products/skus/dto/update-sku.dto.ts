import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateSkuDto {
    @ApiProperty({ type: Number, description: "Product price" })
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    price?: number;

    @ApiProperty({ type: String, format: 'uuid', description: "Product attribute option id" })
    @IsUUID()
    @IsOptional()
    attributeOptionId?: string;
}
