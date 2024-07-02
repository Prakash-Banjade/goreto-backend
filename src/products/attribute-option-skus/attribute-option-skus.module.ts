import { Module } from '@nestjs/common';
import { AttributeOptionSkusService } from './attribute-option-skus.service';
import { AttributeOptionSkusController } from './attribute-option-skus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeOptionSku } from './entities/attribute-option-skus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttributeOptionSku]),
  ],
  controllers: [AttributeOptionSkusController],
  providers: [AttributeOptionSkusService],
})
export class AttributeOptionSkusModule { }
