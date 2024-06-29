import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoriesService } from './sub-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      SubCategory
    ]),
  ],
  controllers: [CategoriesController, SubCategoryController],
  providers: [CategoriesService, SubCategoriesService],
  exports: [CategoriesService, SubCategoriesService],
})
export class CategoriesModule { }
