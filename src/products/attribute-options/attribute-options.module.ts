import { Module } from '@nestjs/common';
import { AttributeOptionsController } from './attribute-options.controller';
import { AttributeOptionService } from './attribute-options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeOption } from './entities/attribute-option.entity';
import { AttributesModule } from '../attributes/attributes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttributeOption]),
    AttributesModule,
  ],
  controllers: [AttributeOptionsController],
  providers: [AttributeOptionService],
  exports: [AttributeOptionService],
})
export class AttributeOptionsModule { }
