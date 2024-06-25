import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";
import { CONSTANTS } from "src/core/CONSTANTS";

export class CreateProductDto {
    @ApiProperty({ type: String, description: "Product name" })
    @IsString()
    @IsNotEmpty()
    productName: string;

    @ApiProperty({ type: String, description: "Product description" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: Number, description: "Product price" })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Product price must be a real number');
        return Number(value);
    })
    price: number;

    @ApiPropertyOptional({ type: String, description: "Product price unit", default: CONSTANTS.defaultProductPriceUnit })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    priceUnit?: string;

    @ApiProperty({ type: Number, description: "Product stock quantity" })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Product stock quantity must be a real number');
        return Number(value);
    })
    stockQuantity: number;

    @ApiProperty({ type: String, format: "binary", description: "Product cover image" })
    @IsFile({ message: 'Invalid type for cover image. Cover image must be a file', always: true })
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for cover image. Cover image must be a jpeg or png or webp' })
    @IsNotEmpty()
    coverImage: FileSystemStoredFile;

    @ApiPropertyOptional({ type: [String], format: "binary", description: "Product other images" })
    @IsOptional()
    @IsFile({ message: 'Invalid type for other images. Other images must be files', each: true })
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for other images. Other images must be jpeg or png or webp', each: true })
    otherImages?: FileSystemStoredFile[];

    @ApiProperty({ type: String, description: "Product category id" })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;
    
    @ApiPropertyOptional({ type: String, description: "Product cut type id" })
    @IsUUID()
    @IsOptional()
    cutTypeId: string;

    @ApiPropertyOptional({ type: String, description: "Product preparation type id" })
    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    preparationTypeId?: string;
}
