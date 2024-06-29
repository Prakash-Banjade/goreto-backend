import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Brackets, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import getImageURL from 'src/core/utils/getImageURL';
import { generateSlug } from 'src/core/utils/generateSlug';
import { CategoryQueryDto } from './dto/category-query.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoriesRepo.findOneBy({ categoryName: createCategoryDto.categoryName });
    if (existingCategory) throw new BadRequestException('Category already exists');

    // evaluate coverImage
    const coverImage = getImageURL(createCategoryDto.coverImage);

    const slug = generateSlug(createCategoryDto.categoryName);

    const newCategory = this.categoriesRepo.create({
      ...createCategoryDto,
      coverImage,
      slug,
    });
    return await this.categoriesRepo.save(newCategory);
  }

  async findAll(queryDto: CategoryQueryDto) {
    const queryBuilder = this.categoriesRepo.createQueryBuilder('category');

    queryBuilder
      .orderBy("category.createdAt", queryDto.order)
      .leftJoinAndSelect("category.subCategories", "subCategory")
      .andWhere(new Brackets(qb => {
        qb.where([
          { categoryName: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(slug: string) {
    const existingCategory = await this.categoriesRepo.findOne({
      where: { slug },
      relations: { subCategories: true }
    });
    if (!existingCategory) throw new Error('Category not found');

    return existingCategory;
  }

  async update(slug: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.findOne(slug);

    // evaluate coverImage
    const coverImage = updateCategoryDto.coverImage ? getImageURL(updateCategoryDto.coverImage) : existingCategory.coverImage;
    Object.assign(existingCategory, { ...updateCategoryDto, coverImage });
    return await this.categoriesRepo.save(existingCategory);
  }

  async remove(slug: string) {
    const existingCategory = await this.findOne(slug);

    return await this.categoriesRepo.remove(existingCategory);
  }
}
