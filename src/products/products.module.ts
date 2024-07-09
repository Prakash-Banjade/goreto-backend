import { Global, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsRepository } from './repository/product.repository';
import { DiscountRepository } from './repository/discount.repository';
import { ProductImage } from './skus/entities/product-image.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Sku } from './skus/entities/sku.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Category,
      Sku,
    ]),
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, DiscountRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule { }
