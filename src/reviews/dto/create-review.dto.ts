import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
    @ApiProperty({ type: String, description: 'Product Slug' })
    @IsString()
    @IsNotEmpty()
    productId: string; // product slug

    @ApiProperty({ type: Number, description: 'Product Rating' })
    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;

    @ApiProperty({ type: String, description: 'Product Comment' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    comment?: string;
}
