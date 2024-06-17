import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";

export class CreateCategoryDto {
    @ApiProperty({ type: String, description: 'Category name' })
    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @ApiProperty({ type: String, description: 'Category cover image' })
    @IsFile()
    @HasMimeType(['image/png', 'image/jpg', 'image/jpeg'])
    @IsNotEmpty()
    coverImage: FileSystemStoredFile;

    @ApiProperty({ type: String, description: 'Category description' })
    @IsString()
    @IsNotEmpty()
    description: string;
}
