import { CreateAddressDto } from "src/addresses/dto/create-address.dto";

export function extractAddressDto<T extends CreateAddressDto>(dto: T) {
    return {
        address1: dto.address1,
        address2: dto.address2,
        city: dto.city,
        country: dto.country,
        province: dto.province,
        zipCode: dto.zipCode
    }
}