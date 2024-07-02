import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";
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
    slug: string;

    // @ApiProperty({ type: Number, description: "Product stock quantity" })
    // @IsNotEmpty()
    // @Transform(({ value }) => {
    //     if (isNaN(parseInt(value))) throw new BadRequestException('Product stock quantity must be a real number');
    //     return Number(value);
    // })
    // stockQuantity: number;

    @ApiProperty({ type: String, format: "binary", description: "Product featured image" })
    @IsFile({ message: 'Invalid type for featured image. Cover image must be a file', always: true })
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for featured image. Cover image must be a jpeg or png or webp' })
    @IsNotEmpty()
    featuredImage: FileSystemStoredFile;

    @ApiProperty({ type: String, description: "Product category id" })
    @IsString()
    @IsNotEmpty()
    categorySlug: string;

    @ApiPropertyOptional({ type: String, description: "Product cut type id" })
    @IsUUID()
    @IsOptional()
    cutTypeId?: string;

    @ApiPropertyOptional({ type: String, description: "Product preparation type id" })
    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    preparationTypeId?: string;
}