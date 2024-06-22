import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CancelOrderDto {
    @ApiProperty({ type: String, description: 'Reason for cancellation' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiPropertyOptional({ type: String, description: 'Reason description' })
    @IsString()
    @IsOptional()
    @MaxLength(500, { message: 'Description is too long, maximum 500 characters allowed.' })
    description?: string;
}