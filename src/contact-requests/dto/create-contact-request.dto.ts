import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateContactRequestDto {

    @ApiProperty({type: String, description: 'Email'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({type: String, description: 'Name'})
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({type: String, description: 'Message'})
    @IsNotEmpty()
    @IsString()
    message: string;
}
