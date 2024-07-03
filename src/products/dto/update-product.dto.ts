import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['featuredImage', 'gallery'] as const)) {
    @ApiPropertyOptional({ type: String, format: "binary", description: "Product featured image" })
    @IsOptional()
    featuredImage: FileSystemStoredFile | string;

    @ApiPropertyOptional({ type: [String], format: "binary", description: "Product other images" })
    @IsOptional()
    gallery?: FileSystemStoredFile[] | string[] | (FileSystemStoredFile | string)[];
}
