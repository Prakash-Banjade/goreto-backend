import { Module } from '@nestjs/common';
import { CutTypesService } from './cut-types.service';
import { CutTypesController } from './cut-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CutType } from './entities/cut-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CutType,
    ]),
  ],
  controllers: [CutTypesController],
  providers: [CutTypesService],
  exports: [CutTypesService],
})
export class CutTypesModule { }
