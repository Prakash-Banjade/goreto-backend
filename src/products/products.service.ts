import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Brackets, Equal, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import getImageURL from 'src/core/utils/getImageURL';
import { ProductQueryDto } from './dto/product-query.dto';
import { Deleted } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { CategoriesService } from 'src/categories/categories.service';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { ProductImage } from './skus/entities/product-image.entity';
import { DeleteManyWithSlugsDto } from 'src/core/dto/deleteManyDto';
import { Category } from 'src/categories/entities/category.entity';
import { Sku } from './skus/entities/sku.entity';
import { ProductType } from 'src/core/types/global.types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(ProductImage) private readonly productImageRepo: Repository<ProductImage>,
    @InjectRepository(Sku) private readonly skuRepo: Repository<Sku>,
    private readonly categoryService: CategoriesService,
  ) { }

  async create(createProductDto: CreateProductDto) {
    // evaluate category
    const category = await this.categoryService.findOne(createProductDto.categorySlug);

    // evaluate featuredImage
    const featuredImage = getImageURL(createProductDto.featuredImage);

    const product = this.productRepo.create({
      productName: createProductDto.productName,
      description: createProductDto.description,
      slug: createProductDto?.slug,
      productType: createProductDto.productType,
      category,
      featuredImage,
    });

    const savedProduct = await this.productRepo.save(product);

    await this.uploadGallery(savedProduct, createProductDto?.gallery);

    if (product.productType === ProductType.SIMPLE) await this.createSkuForSimpleProduct(savedProduct, createProductDto);

    // increase category totalProductsCount
    category.totalProductsCount++;
    await this.categoriesRepo.save(category);

    return {
      message: 'Product created',
      productSlug: savedProduct.slug
    };
  }

  async uploadGallery(product: Product, gallery: FileSystemStoredFile[] | string[] | (FileSystemStoredFile | string)[] | undefined) {
    // evaluate featured images
    if (gallery) {
      for (const image of gallery) {
        const url = getImageURL(image);
        const newImage = this.productImageRepo.create({
          url,
          simpleProduct: product,
        });
        await this.productImageRepo.save(newImage);
      }
    }
  }

  async createSkuForSimpleProduct(product: Product, createProductDto: CreateProductDto) {
    const newSku = this.skuRepo.create({
      product,
      code: product.code,
      gallery: product.gallery,
      price: createProductDto?.price,
      salePrice: createProductDto?.salePrice,
      stockQuantity: createProductDto?.stockQuantity,
    });
    await this.skuRepo.save(newSku);
  }

  async updateSkuForSimpleProduct(product: Product, updateProductDto: UpdateProductDto) {
    Object.assign(product.skus[0], {
      product,
      code: product.code,
      gallery: product.gallery,
      price: updateProductDto?.price,
      salePrice: updateProductDto?.salePrice,
      stockQuantity: updateProductDto?.stockQuantity,
    });
    await this.skuRepo.save(product.skus[0]);
  }

  async findAll(queryDto: ProductQueryDto) {
    const queryBuilder = this.skuRepo.createQueryBuilder('sku');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    const category = await this.categoriesRepo
      .createQueryBuilder('category')
      .where('category.slug = :slug', { slug: queryDto.categorySlug })
      .getOne();

    let categoryIds: string[] = [];

    if (category) {
      const categories = await this.categoriesRepo
        .createQueryBuilder('category')
        .where('category.left BETWEEN :left AND :right', { left: category.left, right: category.right })
        .getMany();

      categoryIds = categories.map(cat => cat.id);
    }

    queryBuilder
      .leftJoinAndSelect("sku.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.gallery", "gallery")
      .leftJoinAndSelect("product.reviews", "reviews")
      .orderBy("product.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        queryDto.search && qb.andWhere("LOWER(product.productName) LIKE LOWER(:productName)", { productName: `%${queryDto.search ?? ''}%` });
        category && qb.andWhere('category.id IN (:...categoryIds)', { categoryIds });
        queryDto.priceFrom && qb.andWhere("salePrice >= :priceFrom", { priceFrom: queryDto.priceFrom });
        queryDto.priceTo && qb.andWhere("salePrice <= :priceTo", { priceTo: queryDto.priceTo });
        queryDto.ratingFrom && qb.andWhere("product.rating >= :ratingFrom", { ratingFrom: queryDto.ratingFrom });
        queryDto.ratingTo && qb.andWhere("product.rating <= :ratingTo", { ratingTo: queryDto.ratingTo });
      }));

    return paginatedData(queryDto, queryBuilder);
  }


  async findOne(slug: string) {
    const existing = await this.productRepo.findOne({
      where: { slug: Equal(slug) },
      relations: {
        category: true,
        gallery: true,
        reviews: true,
        skus: {
          attributeOptions: {
            attribute: true
          },
          gallery: true,
        }
      },
      select: {
        category: {
          categoryName: true,
          slug: true,
        }
      }
    });

    if (!existing) throw new NotFoundException('Product not found');
    return existing;
  }

  async update(slug: string, updateProductDto: UpdateProductDto) {
    const existing = await this.findOne(slug);

    // evaluate cutType, preparationType, category
    const category = updateProductDto.categorySlug ? await this.categoryService.findOne(updateProductDto.categorySlug) : existing.category;

    // evaluate featuredImage
    const featuredImage = updateProductDto.featuredImage ? getImageURL(updateProductDto.featuredImage) : existing.featuredImage;

    Object.assign(existing, {
      ...updateProductDto,
      category,
      featuredImage,
    })

    const savedProduct = await this.productRepo.save(existing);

    await this.uploadGallery(savedProduct, updateProductDto?.gallery);

    await this.updateSkuForSimpleProduct(savedProduct, updateProductDto);

    return {
      message: 'Product updated',
      productSlug: savedProduct.slug
    }
  }

  async remove({ slugs }: DeleteManyWithSlugsDto) {
    const existingProducts = await this.productRepo.find({
      where: {
        slug: In(slugs)
      },
    });
    if (!existingProducts?.length) throw new BadRequestException('Product not found');
    await this.productRepo.softRemove(existingProducts);

    return {
      success: true,
      message: 'Products removed',
    }
  }

  async restore({ slugs }: DeleteManyWithSlugsDto) {
    const existingProducts = await this.productRepo.find({
      where: { slug: In(slugs) },
      withDeleted: true,
    })
    if (!existingProducts) throw new BadRequestException('Product not found');

    return await this.productRepo.restore(slugs);
  }

  async clearTrash() {
    return await this.productRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
