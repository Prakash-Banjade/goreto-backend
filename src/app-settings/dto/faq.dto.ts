import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFaqDto {
    @ApiProperty({ type: String, description: 'Title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ type: String, description: 'Description' })
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateFaqDto extends PartialType(CreateFaqDto) { }