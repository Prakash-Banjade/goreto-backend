import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkuDto, SkuImageDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sku } from './entities/sku.entity';
import { Repository } from 'typeorm';
import getImageURL from 'src/core/utils/getImageURL';
import { ProductsService } from '../products.service';
import { AttributeOptionService } from '../attribute-options/attribute-options.service';
import { CONSTANTS } from 'src/core/CONSTANTS';
import { AttributeOption } from '../attribute-options/entities/attribute-option.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductType } from 'src/core/types/global.types';

@Injectable()
export class SkusService {
  constructor(
    @InjectRepository(Sku) private readonly skuRepo: Repository<Sku>,
    @InjectRepository(ProductImage) private readonly productImageRepo: Repository<ProductImage>,
    private readonly productsService: ProductsService,
    private readonly attributeOptionService: AttributeOptionService,
  ) { }

  async create(createSkuDto: CreateSkuDto) {
    const product = await this.productsService.findOne(createSkuDto.productSlug)

    // CHECK IF THE PRODUCT IS VARIABLE
    if (product.productType !== ProductType.VARIABLE) throw new BadRequestException('Product must be variable type');

    for (const sku of createSkuDto.skus) {
      const attributeOptions = await Promise.all(
        sku.attributeOptionIds.map(async (attributeOptionId) => {
          return await this.attributeOptionService.findOne(attributeOptionId)
        })
      )

      // generate sku code
      const code = this.generateSkuCode(attributeOptions, product.code);

      const newSku = this.skuRepo.create({
        price: sku.price,
        salePrice: sku.salePrice,
        stockQuantity: sku.stockQuantity,
        code,
        product,
        attributeOptions: attributeOptions
      });

      await this.skuRepo.save(newSku);
    }

    return {
      message: 'Sku created',
    }

  }

  async uploadSkuImages(id: string, skuImageDto: SkuImageDto) {
    const existing = await this.findOne(id);

    // evaluate featured images
    if (skuImageDto.gallery) {
      for (const image of skuImageDto.gallery) {
        const url = getImageURL(image);
        const newImage = this.productImageRepo.create({
          url,
          sku: existing,
        });
        await this.productImageRepo.save(newImage);
      }
    }

    return {
      message: 'Sku images uploaded',
    }
  }

  generateSkuCode(attributeOptions: AttributeOption[], productCode: string) {
    const brandCode = CONSTANTS.brandCode;
    const attributeValue = attributeOptions.map((attributeOption) => attributeOption.value).join('-');
    const attributeCode = attributeOptions.map((attributeOption) => attributeOption.attribute.code).join('-');

    return `${brandCode}-${productCode}-${attributeCode}-${attributeValue}`

  }

  async findAll() {
    return await this.skuRepo.find();
  }

  async findOne(id: string) {
    const existing = await this.skuRepo.findOne({
      where: { id },
      relations: {
        attributeOptions: true,
        product: true,
      }
    })
    if (!existing) throw new NotFoundException('Sku not found')

    return existing
  }

  async update(id: string, updateSkuDto: UpdateSkuDto) {
    const existing = await this.findOne(id);

    // PRODUCT IS NOT UPDATED IN SKU UPDATE

    const attributeOption = updateSkuDto.attributeOptionId ? await this.attributeOptionService.findOne(updateSkuDto.attributeOptionId) : existing.attributeOptions;

    Object.assign(existing, {
      ...updateSkuDto,
      price: updateSkuDto?.price ? updateSkuDto.price : existing.price,
      attributeOptions: attributeOption
    });

    return await this.skuRepo.save(existing);
  }

  async remove(id: string) {
    return `This action removes a #${id} skus`;
  }
}
