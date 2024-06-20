import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { OrderStatus } from 'src/core/types/global.types';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto {
    @ApiPropertyOptional({ type: 'enum', enum: OrderStatus })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus
}
