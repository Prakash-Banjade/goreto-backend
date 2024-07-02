import { Global, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { CutTypesModule } from 'src/product-filters/cut-types/cut-types.module';
import { PreparationsModule } from 'src/product-filters/preparations/preparations.module';
import { Discount } from './entities/discount.entity';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { ProductsRepository } from './repository/product.repository';
import { AttributesModule } from './attributes/attributes.module';
import { AttributeOptionsModule } from './attribute-options/attribute-options.module';
import { SkusModule } from './skus/skus.module';
import { AttributeOptionSkusModule } from './attribute-option-skus/attribute-option-skus.module';
import { Sku } from './skus/entities/sku.entity';
import { AttributeOptionSku } from './attribute-option-skus/entities/attribute-option-skus.entity';
import { DiscountRepository } from './repository/discount.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Discount,
      Sku,
      AttributeOptionSku
    ]),
    CategoriesModule,
    CutTypesModule,
    PreparationsModule,
    AttributesModule,
    AttributeOptionsModule,
    SkusModule,
    AttributeOptionSkusModule,
  ],
  controllers: [ProductsController, DiscountsController],
  providers: [ProductsService, DiscountsService, ProductsRepository, DiscountRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule { }
