import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentStatus } from 'src/core/types/global.types';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdatePaymentDto {
    @ApiProperty({ type: 'enum', enum: PaymentStatus, description: 'Payment status' })
    @IsEnum(PaymentStatus)
    @IsNotEmpty()
    status: PaymentStatus;
}
