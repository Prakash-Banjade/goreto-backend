import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { FileSystemStoredFile } from "nestjs-form-data";
import { IsUrlOrFile } from "src/core/decorators/IsUrlOrFile.decorator";

export class SeoSettingsDto {
    @ApiPropertyOptional({ type: String, description: 'Meta title' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    metaTitle?: string;

    @ApiPropertyOptional({ type: String, description: 'Meta Description' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    metaDescription?: string;

    @ApiPropertyOptional({ type: String, description: 'Canonical URL' })
    @IsUrl()
    @IsNotEmpty()
    @IsOptional()
    canonicalUrl?: string;

    @ApiPropertyOptional({ type: String, description: 'OG Title' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    ogTitle?: string;

    @ApiPropertyOptional({ type: String, description: 'OG Description' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    ogDescription?: string;

    @ApiPropertyOptional({ type: String, format: 'binary', description: 'OG Image' })
    @IsUrlOrFile()
    @IsOptional()
    ogImage?: FileSystemStoredFile | string;

    @ApiPropertyOptional({ type: String, format: 'binary', description: 'Twitter username' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    twitterUsername?: string;
}
