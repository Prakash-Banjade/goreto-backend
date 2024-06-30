import { BadRequestException } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class ProductQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: String, description: 'Product category slug' })
    @IsString()
    @IsOptional()
    categorySlug?: string;

    @ApiPropertyOptional({ type: String, description: 'Product sub category slug' })
    @IsString()
    @IsOptional()
    subCategorySlug?: string;

    @ApiPropertyOptional({ type: String, description: 'Product price to' })
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Invalid price');
        if (Number(value) < 0) throw new BadRequestException('Invalid price');
        return Number(value);
    })
    @IsOptional()
    priceFrom?: number = 0;

    @ApiPropertyOptional({ type: String, description: 'Product price to' })
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Invalid price');
        if (Number(value) < 0) throw new BadRequestException('Invalid price');
        return Number(value);
    })
    @IsOptional()
    priceTo?: number;

    @ApiPropertyOptional({ type: String, description: 'Product Rating From' })
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Invalid rating from');
        if (Number(value) > 5 || Number(value) < 0) throw new BadRequestException('Invalid rating from');
        return Number(value);
    })
    @IsOptional()
    ratingFrom?: number = 0;

    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Invalid rating to');
        if (Number(value) > 5 || Number(value) < 0) throw new BadRequestException('Invalid rating from');
        return Number(value);
    })
    @IsOptional()
    ratingTo?: number = 5;
}