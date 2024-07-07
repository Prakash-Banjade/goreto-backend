import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";
import { generateSlug } from "src/core/utils/generateSlug";

export class CreateCategoryDto {
    @ApiProperty({ type: String, description: 'Category name' })
    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @ApiPropertyOptional({ type: String, description: 'Parent category slug' })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return generateSlug(value, false);
    })
    slug?: string

    @ApiProperty({ type: String, format: 'binary', description: 'Category featured image' })
    @IsFile()
    @HasMimeType(['image/png', 'image/jpg', 'image/jpeg'])
    @IsNotEmpty()
    featuredImage: FileSystemStoredFile;

    @ApiProperty({ type: String, description: 'Category description' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ type: String, description: 'Parent category slug' })
    @IsString()
    @IsOptional()
    parentCategorySlug?: string;
}
