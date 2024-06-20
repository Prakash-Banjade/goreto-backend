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

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Discount,
    ]),
    CategoriesModule,
    CutTypesModule,
    PreparationsModule,
  ],
  controllers: [ProductsController, DiscountsController],
  providers: [ProductsService, DiscountsService, ProductsRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule { }
