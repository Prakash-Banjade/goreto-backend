import { Module } from '@nestjs/common';
import { AttributeService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attribute]),
  ],
  controllers: [AttributesController],
  providers: [AttributeService],
  exports: [AttributeService],
})
export class AttributesModule { }
