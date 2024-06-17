import { Module } from '@nestjs/common';
import { PreparationsService } from './preparations.service';
import { PreparationsController } from './preparations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preparation } from './entities/preparation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Preparation,
    ])
  ],
  controllers: [PreparationsController],
  providers: [PreparationsService],
  exports: [PreparationsService],
})
export class PreparationsModule {}
