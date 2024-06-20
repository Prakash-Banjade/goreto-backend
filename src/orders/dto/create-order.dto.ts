import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// export class CreateOrderItemDto {
//     @ApiProperty({ type: String, description: 'Product slug' })
//     @IsString()
//     @IsNotEmpty()
//     productId: string;

//     @ApiProperty({ type: Number, description: 'Quantity' })
//     @IsInt()
//     @IsNotEmpty()
//     @Min(1)
//     quantity: number;
// }


export class CreateOrderDto {
    @ApiPropertyOptional({ type: String, format: 'uuid', description: 'Shipping address' })
    @IsUUID()
    @IsOptional()
    shippingAddressId?: string;

    // @ApiProperty({ type: [CreateOrderItemDto], description: 'Order items' })
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => CreateOrderItemDto)
    // items: CreateOrderItemDto[];

    @ApiProperty({ type: [String], format: 'uuid', isArray: true, description: 'Cart items Ids' })
    @IsUUID('all', { each: true })
    cartItemIds: string[]
}
