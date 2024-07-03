import { BadRequestException } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateSkuDto {
    @ApiPropertyOptional({ type: Number, description: "Product price" })
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    price?: number;

    @ApiPropertyOptional({ type: String, format: 'uuid', description: "Product attribute option id" })
    @IsUUID()
    @IsOptional()
    attributeOptionId?: string;

    @ApiPropertyOptional({ type: Number, description: "Product stock quantity" })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Product stock quantity must be a real number');
        return parseInt(value);
    })
    @IsOptional()
    stockQuantity?: number;

    @ApiPropertyOptional({ type: Number, description: "Product sale price" })
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    salePrice?: number;
}
