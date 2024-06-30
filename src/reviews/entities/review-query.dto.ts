import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { QueryDto } from "src/core/dto/query.dto";

export class ReviewQueryDto extends QueryDto {
    @ApiProperty({ type: Number, description: 'Product Rating' })
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    rating?: number;

    @ApiProperty({ type: String, description: 'Product Name' })
    @IsString()
    @IsOptional()
    productName?: string

    @ApiProperty({ type: Number, description: 'Product Rating from' })
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    ratingFrom?: number

    @ApiProperty({ type: Number, description: 'Product Rating to' })
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    ratingTo?: number
}