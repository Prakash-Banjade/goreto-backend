import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsArray, IsOptional, IsString, ValidateNested, IsUUID } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

class ProductSku {
    @ApiProperty({ type: Number, description: "Product price" })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ type: String, format: 'uuid', description: "Product attribute option id" })
    @IsNotEmpty()
    @IsUUID()
    attributeOptionId: string;

    @ApiProperty({ type: Number, description: "Product stock quantity" })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Product stock quantity must be a real number');
        return Number(value);
    })
    stockQuantity: number;
}

export class CreateSkuDto {
    @ApiProperty({ type: String, description: "Product slug" })
    @IsString()
    @IsNotEmpty()
    productSlug: string;

    @ApiProperty({ type: [ProductSku], description: "Product skus" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductSku)
    skus: ProductSku[];
}

export class SkuImageDto {
    @ApiPropertyOptional({ type: [String], format: "binary", description: "Product other images" })
    @IsOptional()
    // @IsFile({ message: 'Invalid type for other images. Other images must be files', each: true })
    // @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for other images. Other images must be jpeg or png or webp', each: true })
    images?: FileSystemStoredFile[] | string[] | (FileSystemStoredFile | string)[];
}

