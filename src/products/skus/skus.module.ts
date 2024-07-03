import { Global, Module } from '@nestjs/common';
import { SkusService } from './skus.service';
import { SkusController } from './skus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sku } from './entities/sku.entity';
import { ProductImage } from './entities/product-image.entity';
import { AttributeOptionsModule } from '../attribute-options/attribute-options.module';
import { SkuRepository } from './repository/sku.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Sku, ProductImage]),
    AttributeOptionsModule,
  ],
  controllers: [SkusController],
  providers: [SkusService, SkuRepository],
  exports: [SkusService, SkuRepository],
})
export class SkusModule { }
