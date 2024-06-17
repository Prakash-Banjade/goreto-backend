import { PartialType } from '@nestjs/swagger';
import { CreateCutTypeDto } from './create-cut-type.dto';

export class UpdateCutTypeDto extends PartialType(CreateCutTypeDto) {}
