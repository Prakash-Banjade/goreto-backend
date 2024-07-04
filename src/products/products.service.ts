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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage) private readonly productImageRepo: Repository<ProductImage>,
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
      price: createProductDto?.price,
      salePrice: createProductDto?.salePrice,
      stockQuantity: createProductDto?.stockQuantity,
      category,
      featuredImage,
    });

    const savedProduct = await this.productRepo.save(product);

    await this.uploadGallery(savedProduct, createProductDto?.gallery);

    return savedProduct;

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

  async findAll(queryDto: ProductQueryDto) {
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("product.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.gallery", "gallery")
      .leftJoinAndSelect("product.skus", "sku")
      .andWhere(new Brackets(qb => {
        qb.where([
          { productName: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        queryDto.categorySlug && qb.andWhere("category.slug = :categorySlug", { categorySlug: `%${queryDto.categorySlug ?? ''}%` });
        queryDto.categorySlug && qb.andWhere("subCategory.slug = :categorySlug", { categorySlug: `%${queryDto.categorySlug ?? ''}%` });
        // queryDto.priceFrom && qb.andWhere("product.price >= :priceFrom", { priceFrom: queryDto.priceFrom });
        // queryDto.priceTo && qb.andWhere("product.price <= :priceTo", { priceTo: queryDto.priceTo });
        queryDto.ratingFrom && qb.andWhere("product.rating >= :ratingFrom", { ratingFrom: queryDto.ratingFrom });
        queryDto.ratingTo && qb.andWhere("product.rating <= :ratingTo", { ratingTo: queryDto.ratingTo });
        queryDto.stockQuantity && qb.andWhere("product.stockQuantity >= :stockQuantity", { stockQuantity: queryDto.stockQuantity });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(slug: string) {
    const existing = await this.productRepo.findOne({
      where: { slug: Equal(slug) },
      relations: {
        category: true,
        gallery: true,
        skus: {
          attributeOptions: {
            attribute: true
          },
          gallery: true,
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

    return {
      message: 'Product updated',
      productId: savedProduct.id,
    }
  }

  async remove(ids: string[]) {
    const existingProducts = await this.productRepo.find({
      where: {
        id: In(ids)
      },
    });
    await this.productRepo.softRemove(existingProducts);

    return {
      success: true,
      message: 'Products removed',
    }
  }

  async restore(ids: string[]) {
    const existingProducts = await this.productRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingProducts) throw new BadRequestException('Product not found');

    return await this.productRepo.restore(ids);
  }

  async clearTrash() {
    return await this.productRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
