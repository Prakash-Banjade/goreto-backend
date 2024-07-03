import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";
import { ProductType } from "src/core/types/global.types";
import { generateSlug } from "src/core/utils/generateSlug";

export class CreateProductDto {
    @ApiProperty({ type: String, description: "Product name" })
    @IsString()
    @IsNotEmpty()
    productName: string;

    @ApiProperty({ type: String, description: "Product description" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: String, description: "Product slug" })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return generateSlug(value);
    })
    slug?: string;

    @ApiProperty({ type: String, description: "Product category id" })
    @IsString()
    @IsNotEmpty()
    categorySlug: string;

    @ApiProperty({ type: 'enum', enum: ProductType, description: "Product type" })
    @IsEnum(ProductType)
    @IsNotEmpty()
    productType: ProductType;

    @ApiProperty({ type: String, format: "binary", description: "Product featured image" })
    @IsFile({ message: 'Invalid type for featured image. Featured image must be a file', always: true })
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for featured image. Featured image must be a jpeg or png or webp' })
    @IsNotEmpty()
    featuredImage: FileSystemStoredFile;

    @ApiPropertyOptional({ type: [String], format: "binary", description: "Product other images" })
    @IsFile({ message: 'Invalid type for other images. Featured images must be files', each: true })
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for featured images. Featured images must be jpeg or png or webp', each: true })
    @IsOptional()
    gallery?: FileSystemStoredFile[]

    /**
    |--------------------------------------------------
    | SINGLE PRODUCT TYPE VALIDATIONS
    |--------------------------------------------------
    */

    @ApiProperty({ type: Number, description: "Product price" })
    @IsNotEmpty()
    @ValidateIf((o) => o.productType === ProductType.SIMPLE)
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Product price must be a real number');
        return Number(value);
    })
    price: number;

    @ApiPropertyOptional({ type: Number, description: "Product price" })
    @IsNotEmpty()
    @IsOptional()
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Product sales price must be a real number');
        return Number(value);
    })
    salesPrice?: number;

    @ApiProperty({ type: Number, description: "Product stock quantity" })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Product stock quantity must be a real number');
        return parseInt(value);
    })
    @ValidateIf((o) => o.productType === ProductType.SIMPLE)
    stockQuantity: number;
}