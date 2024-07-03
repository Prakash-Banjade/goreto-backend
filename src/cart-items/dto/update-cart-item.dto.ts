import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class UpdateCartItemDto {
    @ApiPropertyOptional({ type: Number, description: 'Quantity' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Quantity must be a number')
        return parseInt(value)
    })
    @IsNotEmpty() // must use @IsNotEmpty() with @Transform()
    @IsOptional()
    quantity?: number;
}
