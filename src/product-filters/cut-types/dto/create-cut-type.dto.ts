import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCutTypeDto {
    @ApiProperty({ type: String, description: 'Cut type name' })
    @IsString()
    @IsNotEmpty()
    cutTypeName: string;

    @ApiProperty({ type: String, description: 'Cut type description' })
    @IsString()
    @IsNotEmpty()
    description: string;
}
