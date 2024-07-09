import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, IsUUID, ValidateIf } from "class-validator";
import { ProductType } from "src/core/types/global.types";

export class CreateCartItemDto {
    @ApiProperty({ type: String, description: 'Product sku id' })
    @IsUUID()
    @IsNotEmpty()
    @ValidateIf((o) => o.productType === ProductType.VARIABLE)
    skuId: string;

    @ApiProperty({ type: Number, description: 'Quantity' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Quantity must be a number')
        return parseInt(value)
    })
    @IsNotEmpty() // must use @IsNotEmpty() with @Transform()
    quantity: number;
}
