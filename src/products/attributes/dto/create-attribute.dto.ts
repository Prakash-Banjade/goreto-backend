import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAttributeDto {
    @ApiProperty({ type: String, description: 'Attribute name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: String, description: 'Attribute code', example: 'D, S' })
    @IsString()
    @IsNotEmpty()
    code: string;
}
