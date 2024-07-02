import { PartialType } from '@nestjs/swagger';
import { CreateAttributeOptionSkusDto } from './create-attribute-option-skus.dto';

export class UpdateAttributeOptionSkusDto extends PartialType(CreateAttributeOptionSkusDto) {}
