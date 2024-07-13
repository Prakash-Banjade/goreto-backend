import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class NewsletterDto {
    @ApiProperty({ type: String, description: 'Email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}