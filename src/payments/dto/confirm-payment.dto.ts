import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmPaymentDto {

    @ApiProperty({ type: String, description: 'Payment intent id' })
    @IsString()
    @IsNotEmpty()
    paymentIntentId: string
}