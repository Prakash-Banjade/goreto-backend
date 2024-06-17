import { PartialType } from '@nestjs/swagger';
import { CreatePreparationDto } from './create-preparation.dto';

export class UpdatePreparationDto extends PartialType(CreatePreparationDto) {}
