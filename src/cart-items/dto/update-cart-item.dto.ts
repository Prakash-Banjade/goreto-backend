import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class UpdateCartItemDto {
    @ApiPropertyOptional({ type: Number, description: 'Quantity' })
    @Transform(({ value }) => {
        const numValue = parseInt(value)
        if (isNaN(numValue)) throw new BadRequestException('Quantity must be a number')
        if (numValue < 1) throw new BadRequestException('Quantity must be greater than 0')

        return numValue
    })
    @IsNotEmpty() // must use @IsNotEmpty() with @Transform()
    @IsOptional()
    quantity?: number;

    @ApiPropertyOptional({ type: Boolean })
    @IsBoolean()
    @IsOptional()
    selected?: boolean = false;
}
