import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"
import { FileSystemStoredFile } from "nestjs-form-data"
import { IsUrlOrFile } from "src/core/decorators/IsUrlOrFile.decorator"

export class CreateLocationDto {
    @ApiProperty({ type: String, description: 'Location address' })
    @IsString()
    @IsNotEmpty()
    address: string

    @ApiProperty({ type: String, format: 'binary', description: 'Location image' })
    @IsUrlOrFile()
    @IsNotEmpty()
    image: FileSystemStoredFile | string
}

export class CreateLocationSettingDto {
    @ApiPropertyOptional({ type: String, example: 'Location' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    preTitle: string

    @ApiProperty({ type: String, example: 'We offer services in different locations!' })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ type: String, description: 'Sub title' })
    @IsString()
    @IsNotEmpty()
    subTitle: string
}

export class LocationSettingDto extends PartialType(CreateLocationSettingDto) { }
export class LocationSettingUpdateDto extends PartialType(CreateLocationSettingDto) { }