import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";

export class CreateCategoryDto {
    @ApiProperty({ type: String, description: 'Category name' })
    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @ApiProperty({ type: String, format: 'binary', description: 'Category cover image' })
    @IsFile()
    @HasMimeType(['image/png', 'image/jpg', 'image/jpeg'])
    @IsNotEmpty()
    coverImage: FileSystemStoredFile;

    @ApiProperty({ type: String, description: 'Category description' })
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class CreateSubCategoryDto {
    @ApiProperty({ type: String, description: 'Parent category slug' })
    @IsString()
    @IsNotEmpty()
    categorySlug: string;

    @ApiProperty({ type: String, description: 'Sub Category name' })
    @IsString()
    @IsNotEmpty()
    subCategoryName: string;

    @ApiProperty({ type: String, format: 'binary', description: 'Cover image' })
    @IsFile()
    @IsOptional()
    coverImage?: FileSystemStoredFile;

    @ApiProperty({ type: String, description: 'Category description' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;
}
