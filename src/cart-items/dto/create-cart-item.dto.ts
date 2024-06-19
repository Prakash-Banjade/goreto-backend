import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCartItemDto {
    @ApiProperty({ type: String, description: 'Product slug' })
    @IsString()
    @IsNotEmpty()
    productId: string; // product slug

    @ApiProperty({ type: Number, description: 'Quantity' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Quantity must be a number')
        return parseInt(value)
    })
    @IsNotEmpty() // must use @IsNotEmpty() with @Transform()
    quantity: number;
}
