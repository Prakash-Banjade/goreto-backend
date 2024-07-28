import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class OrderQueryDto extends QueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    trackingNumber?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    cancelled?: string;

    @IsString()
    @IsOptional()
    recent: string;
}