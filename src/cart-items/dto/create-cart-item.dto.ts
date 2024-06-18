import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateCartItemDto {
    @ApiProperty({ type: String, format: 'uuid', description: 'Cart ID' })
    @IsUUID()
    cartId: string;

    @ApiProperty({ type: String, format: 'uuid', description: 'Product ID' })
    @IsUUID()
    productId: string;

    @ApiProperty({ type: Number, description: 'Quantity' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Quantity must be a number')
        return parseInt(value)
    })
    quantity: number = 1;
}
