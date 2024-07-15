import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";
import { ReportPeriod } from "src/core/types/global.types";

export class PaymentQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: 'enum', enum: ReportPeriod })
    @IsOptional()
    period?: ReportPeriod

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    dateFrom?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    dateTo?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    trackingNumber: string;
}