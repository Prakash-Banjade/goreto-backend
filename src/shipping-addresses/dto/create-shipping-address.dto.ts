import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsUUID } from "class-validator";
import { CreateAddressDto } from "src/addresses/dto/create-address.dto";

export class CreateShippingAddressDto extends CreateAddressDto {
    // @ApiProperty({ type: String, format: 'uuid', description: 'User ID' })
    // @IsUUID()
    // userId: string; // userId will be used of the current logged in user

    @ApiPropertyOptional({ type: Boolean, default: false, description: 'Is this address the default shipping address?' })
    @IsBoolean()
    @IsOptional()
    default?: boolean = false;
}
