import { forwardRef, Module } from '@nestjs/common';
import { AttributeService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributeOptionsModule } from '../attribute-options/attribute-options.module';
import { AttributeOption } from '../attribute-options/entities/attribute-option.entity';
import { AttributesRepository } from './repository/attributes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attribute, AttributeOption]),
    forwardRef(() => AttributeOptionsModule),
  ],
  controllers: [AttributesController],
  providers: [AttributeService, AttributesRepository],
  exports: [AttributeService],
})
export class AttributesModule { }
