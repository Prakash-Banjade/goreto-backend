import { BadRequestException } from "@nestjs/common";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateDiscountDto {
    @ApiProperty({ type: String, description: 'Product slug' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ type: Number, description: 'Discount percentage' })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(Number(value))) throw new BadRequestException('Discount percentage must be a real number');
        return Number(value);
    })
    @Max(100)
    @Min(0)
    discountPercentage: number;

    @ApiProperty({ type: String, format: 'date', description: 'Discount start date (ISO string fomat)' })
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @ApiProperty({ type: String, format: 'date', description: 'Discount end date (ISO string fomat)' })
    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) { }

