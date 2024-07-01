import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Brackets, Equal, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { CutTypesService } from 'src/product-filters/cut-types/cut-types.service';
import { PreparationsService } from 'src/product-filters/preparations/preparations.service';
import getImageURL from 'src/core/utils/getImageURL';
import { ProductQueryDto } from './dto/product-query.dto';
import { Deleted } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { generateSlug } from 'src/core/utils/generateSlug';
import { SubCategoriesService } from 'src/categories/sub-category.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly subCategoryService: SubCategoriesService,
    private readonly cutTypeService: CutTypesService,
    private readonly preparationService: PreparationsService
  ) { }

  async create(createProductDto: CreateProductDto) {
    // evaluate cutType, preparationType, category
    const dependencies = await this.extractDependencies(createProductDto)

    // evaluate coverImage
    const coverImage = getImageURL(createProductDto.coverImage);

    // evaluate otherImages
    let images: string[] = [];
    if (createProductDto.otherImages) {
      images = createProductDto.otherImages.map(image => getImageURL(image));
    }

    const slug = generateSlug(createProductDto.productName)

    const product = this.productRepo.create({
      ...createProductDto,
      ...dependencies,
      coverImage,
      slug,
      otherImages: images
    });

    return await this.productRepo.save(product);
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
      .leftJoinAndSelect("product.subCategory", "subCategory")
      .leftJoinAndSelect("subCategory.category", "category")
      .leftJoinAndSelect("product.discount", "discount")
      .leftJoinAndSelect("product.cutType", "cutType")
      .leftJoinAndSelect("product.preparation", "preparation")
      .andWhere(new Brackets(qb => {
        qb.where([
          { productName: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        queryDto.categorySlug && qb.andWhere("category.slug = :categorySlug", { categorySlug: `%${queryDto.categorySlug ?? ''}%` });
        queryDto.subCategorySlug && qb.andWhere("subCategory.slug = :subCategorySlug", { subCategorySlug: `%${queryDto.subCategorySlug ?? ''}%` });
        queryDto.priceFrom && qb.andWhere("product.price >= :priceFrom", { priceFrom: queryDto.priceFrom });
        queryDto.priceTo && qb.andWhere("product.price <= :priceTo", { priceTo: queryDto.priceTo });
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
        subCategory: true,
        discount: true,
        cutType: true,
        preparation: true,
      }
    });

    if (!existing) throw new NotFoundException('Product not found');
    return existing;
  }

  async update(slug: string, updateProductDto: UpdateProductDto) {
    const existing = await this.findOne(slug);

    // evaluate cutType, preparationType, category
    const dependencies = await this.extractDependencies(updateProductDto, existing)

    // evaluate coverImage
    const coverImage = updateProductDto.coverImage ? getImageURL(updateProductDto.coverImage) : existing.coverImage;

    // evaluate otherImages
    // TODO: also handle previously uploaded other images
    let images: string[] = [];
    if (updateProductDto.otherImages) {
      images = updateProductDto.otherImages.map((image: string | FileSystemStoredFile) => getImageURL(image));
    }

    Object.assign(existing, {
      ...updateProductDto,
      ...dependencies,
      coverImage,
      otherImages: images
    })

    return await this.productRepo.save(existing);
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

  private async extractDependencies(productDto: CreateProductDto | UpdateProductDto, existing?: Product) {
    const category = productDto.subCategorySlug ? await this.subCategoryService.findOne(productDto.subCategorySlug) : (existing?.subCategory ?? null);
    const preparation = productDto.preparationTypeId ? await this.preparationService.findOne(productDto.preparationTypeId) : (existing?.preparation ?? null);
    const cutType = productDto.cutTypeId ? await this.cutTypeService.findOne(productDto.cutTypeId) : (existing?.cutType ?? null);

    return { category, preparation, cutType }
  }
}
