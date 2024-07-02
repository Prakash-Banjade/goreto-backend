import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['featuredImage'] as const)) {
    @ApiPropertyOptional({ type: String, format: "binary", description: "Product featured image" })
    @IsOptional()
    // @IsFile({ message: 'Invalid type for featured image. Cover image must be a file', always: true })
    // @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for featured image. Cover image must be a jpeg or png or webp' })
    featuredImage: FileSystemStoredFile | string;
}
