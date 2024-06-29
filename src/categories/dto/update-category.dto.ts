import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto, CreateSubCategoryDto } from './create-category.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(OmitType(CreateCategoryDto, ['coverImage'])) {
    @ApiProperty({ type: String, format: 'binary', description: 'Category cover image' })
    @IsOptional()
    coverImage?: FileSystemStoredFile | string;
}

export class UpdateSubCategoryDto extends PartialType(OmitType(CreateSubCategoryDto, ['coverImage'])) {
    @ApiProperty({ type: String, format: 'binary', description: 'Category cover image' })
    @IsOptional()
    coverImage?: FileSystemStoredFile | string;
}
