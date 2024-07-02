import { Global, Module } from '@nestjs/common';
import { SkusService } from './skus.service';
import { SkusController } from './skus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sku } from './entities/sku.entity';
import { ProductSkuImage } from './entities/product-sku-image.entity';
import { AttributeOptionsModule } from '../attribute-options/attribute-options.module';
import { SkuRepository } from './repository/sku.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Sku, ProductSkuImage]),
    AttributeOptionsModule,
  ],
  controllers: [SkusController],
  providers: [SkusService, SkuRepository],
  exports: [SkusService, SkuRepository],
})
export class SkusModule { }
