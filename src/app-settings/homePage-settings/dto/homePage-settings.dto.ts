import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { FileSystemStoredFile } from "nestjs-form-data";
import { IsUrlOrFile } from "src/core/decorators/IsUrlOrFile.decorator";

export class CreateHeroCarouselItemDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    subTitle: string

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    actionLabel: string

    @ApiProperty({ type: String })
    @IsUrl()
    @IsNotEmpty()
    actionUrl: string

    @ApiProperty({ type: String })
    @IsUrlOrFile()
    @IsOptional()
    bannerImage: string | FileSystemStoredFile
}

export class UpdateHeroCarouselItemDto extends PartialType(CreateHeroCarouselItemDto) { }

export class HomePageSettingsDto {
    @ApiPropertyOptional({ type: [String], isArray: true, description: 'Categories slug to show up in home page' })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @IsOptional()
    homeCategoriesList?: string[] = []
}