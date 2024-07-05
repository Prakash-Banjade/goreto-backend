import { forwardRef, Module } from '@nestjs/common';
import { AttributeOptionsController } from './attribute-options.controller';
import { AttributeOptionService } from './attribute-options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeOption } from './entities/attribute-option.entity';
import { AttributesModule } from '../attributes/attributes.module';
import { AttributeOptionsRepository } from './repository/attribute-options.reposityr';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttributeOption]),
    AttributesModule,
  ],
  controllers: [AttributeOptionsController],
  providers: [AttributeOptionService, AttributeOptionsRepository],
  exports: [AttributeOptionService, AttributeOptionsRepository],
})
export class AttributeOptionsModule { }
