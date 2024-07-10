import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Brackets, ILike, IsNull, Not, Or, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import getImageURL from 'src/core/utils/getImageURL';
import { CategoryQueryDto } from './dto/category-query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoriesRepo.findOne({
      where: [
        { categoryName: createCategoryDto.categoryName },
        { slug: createCategoryDto?.slug }
      ]
    });
    if (existingCategory) throw new ConflictException('Category with same name or slug already exists');

    const parentSlug = createCategoryDto?.parentCategorySlug

    let parentCategory: Category | null = null
    let left: number;
    let right: number;

    if (parentSlug) {
      parentCategory = await this.categoriesRepo
        .createQueryBuilder('category')
        .where('category.slug = :slug', { slug: parentSlug })
        .getOne();

      if (!parentCategory) {
        throw new Error('Parent category not found');
      }

      left = parentCategory.right;
      right = left + 1;

      // Use backticks around `right` and `left`
      await this.categoriesRepo.query(
        `UPDATE category SET \`right\` = \`right\` + 2 WHERE \`right\` >= ?`,
        [left]
      );
      await this.categoriesRepo.query(
        `UPDATE category SET \`left\` = \`left\` + 2 WHERE \`left\` >= ?`,
        [left]
      );
    } else {
      const maxRight = await this.categoriesRepo
        .createQueryBuilder('category')
        .select('MAX(category.right)', 'maxRight')
        .getRawOne();

      left = (maxRight?.maxRight || 0) + 1;
      right = left + 1;
    }


    // const parentCategory = createCategoryDto?.parentCategorySlug ? await this.categoriesRepo.findOneBy({ slug: createCategoryDto.parentCategorySlug }) : null;
    // if (createCategoryDto?.parentCategorySlug && !parentCategory) throw new NotFoundException('Parent category not found');

    // evaluate featuredImage
    const featuredImage = getImageURL(createCategoryDto.featuredImage);

    const newCategory = this.categoriesRepo.create({
      ...createCategoryDto,
      featuredImage,
      parentCategory,
      left,
      right,
    });

    return await this.categoriesRepo.save(newCategory);
  }

  async findAll(queryDto: CategoryQueryDto) {
    const qb = this.categoriesRepo.createQueryBuilder('category');

    const categories = await qb
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .orderBy('category.createdAt', queryDto.order)
      .andWhere(
        new Brackets(qb => {
          qb.where([{ categoryName: ILike(`%${queryDto.search ?? ''}%`) }]);
        }),
      )
      .andWhere({ parentCategory: queryDto.onlyParents === 'true' ? IsNull() : Or(IsNull(), Not(IsNull())) }).getMany();

    for (const category of categories) {
      category.totalProductsCount = await this.getTotalProductsCount(category);
    }

    return categories;
  }

  async findOne(slug: string) {
    const existingCategory = await this.categoriesRepo.findOne({
      where: { slug },
      relations: { parentCategory: true }
    });
    if (!existingCategory) throw new Error('Category not found');

    existingCategory.totalProductsCount = await this.getTotalProductsCount(existingCategory);

    return existingCategory;
  }

  private async getTotalProductsCount(category: Category): Promise<number> {
    const qb = this.productRepo.createQueryBuilder('product');

    qb.leftJoin('product.category', 'category')
      .leftJoin('category.parentCategory', 'parentCategory')
      .where('category.left BETWEEN :left AND :right', { left: category.left, right: category.right })
      .orWhere('parentCategory.left BETWEEN :left AND :right', { left: category.left, right: category.right });

    return qb.getCount();
  }

  async update(slug: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.findOne(slug);

    const parentCategory = !!updateCategoryDto?.parentCategorySlug ? await this.categoriesRepo.findOneBy({ slug: updateCategoryDto.parentCategorySlug }) : null;
    if (updateCategoryDto?.parentCategorySlug && !parentCategory) throw new NotFoundException('Parent category not found');

    // VALIDATE PARENT CATEGORY
    if (updateCategoryDto?.parentCategorySlug && parentCategory?.slug === existingCategory.slug) throw new BadRequestException('Parent category cannot be itself');

    // evaluate featuredImage
    const featuredImage = updateCategoryDto.featuredImage ? getImageURL(updateCategoryDto.featuredImage) : existingCategory.featuredImage;
    Object.assign(existingCategory, { ...updateCategoryDto, featuredImage });
    return await this.categoriesRepo.save({
      ...existingCategory,
      parentCategory,
    });
  }

  async remove(slug: string) {
    const existingCategory = await this.findOne(slug);

    return await this.categoriesRepo.remove(existingCategory);
  }
}
