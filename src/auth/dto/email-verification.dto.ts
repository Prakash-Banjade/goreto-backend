import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class EmailVerificationDto {
    @ApiProperty({ type: Number })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    otp: number

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    verificationToken: string;
}