import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(OmitType(CreateCategoryDto, ['featuredImage'])) {
    @ApiProperty({ type: String, format: 'binary', description: 'Category featured image' })
    @IsOptional()
    featuredImage?: FileSystemStoredFile | string;
}