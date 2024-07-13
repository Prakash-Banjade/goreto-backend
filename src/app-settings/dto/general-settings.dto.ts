import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileSystemStoredFile, HasMimeType, MaxFileSize } from "nestjs-form-data";
import { IsUrlOrFile } from "src/core/decorators/IsUrlOrFile.decorator";

export class GeneralSettingsDto {
    @ApiProperty({ type: String, description: 'Site title' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    companyName?: string;

    @ApiProperty({ type: String, description: 'Site title' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    siteTitle: string;

    @ApiPropertyOptional({ type: String, description: 'Site subtitle' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    siteSubtitle?: string;

    @ApiProperty({ type: String, format: 'binary', description: 'Site logo' })
    @IsUrlOrFile()
    @IsOptional()
    logo?: FileSystemStoredFile | string;

    @ApiPropertyOptional({ type: String, format: 'binary', description: 'Site collapseLogo logo' })
    @IsUrlOrFile()
    @IsOptional()
    collapseLogo?: FileSystemStoredFile | string;

    @ApiPropertyOptional({ type: String, description: 'Footer description' })
    @IsString()
    @IsOptional()
    footerDescription?: string;
}

export class HomeCategoriesSlugDto {
    @ApiPropertyOptional({ type: String, description: 'Categories slugs to show in homepage' })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @IsOptional()
    homeCategoriesSlug?: string[]
}
