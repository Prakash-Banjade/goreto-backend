import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['coverImage'] as const)) {
    @ApiPropertyOptional({ type: String, format: "binary", description: "Product cover image" })
    @IsOptional()
    // @IsFile({ message: 'Invalid type for cover image. Cover image must be a file', always: true })
    // @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for cover image. Cover image must be a jpeg or png or webp' })
    coverImage: FileSystemStoredFile | string;
}
