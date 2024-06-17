import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePreparationDto {
    @ApiProperty({ type: String, description: 'Preparation type name' })
    @IsString()
    @IsNotEmpty()
    preparationTypeName: string;

    @ApiProperty({ type: String, description: 'Preparation type description' })
    @IsString()
    @IsNotEmpty()
    description: string;
}
