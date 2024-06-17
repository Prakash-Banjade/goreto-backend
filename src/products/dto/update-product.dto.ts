import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['otherImages'] as const)) {
    @ApiPropertyOptional({ type: [String], format: "binary", description: "Product other images" })
    @IsOptional()
    otherImages?: FileSystemStoredFile[] | string[] | (string | FileSystemStoredFile)[];
}
