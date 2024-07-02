import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkuDto, SkuImageDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sku } from './entities/sku.entity';
import { Repository } from 'typeorm';
import { ProductSkuImage } from './entities/product-sku-image.entity';
import getImageURL from 'src/core/utils/getImageURL';
import { ProductsService } from '../products.service';
import { AttributeOptionService } from '../attribute-options/attribute-options.service';
import { CONSTANTS } from 'src/core/CONSTANTS';
import { AttributeOption } from '../attribute-options/entities/attribute-option.entity';

@Injectable()
export class SkusService {
  constructor(
    @InjectRepository(Sku) private readonly skuRepo: Repository<Sku>,
    @InjectRepository(ProductSkuImage) private readonly productSkuImageRepo: Repository<ProductSkuImage>,
    private readonly productsService: ProductsService,
    private readonly attributeOptionService: AttributeOptionService,
  ) { }

  async create(createSkuDto: CreateSkuDto) {
    const product = await this.productsService.findOne(createSkuDto.productSlug)

    for (const sku of createSkuDto.skus) {
      const attributeOption = await this.attributeOptionService.findOne(sku.attributeOptionId);
      // generate sku code
      const code = this.generateSkuCode(attributeOption, product.code);

      const newSku = this.skuRepo.create({
        price: sku.price,
        code,
        product,
        attributeOptions: attributeOption
      });

      await this.skuRepo.save(newSku);
    }

    return {
      message: 'Sku created',
    }

  }

  async uploadSkuImages(id: string, skuImageDto: SkuImageDto) {
    const existing = await this.findOne(id);

    // evaluate images
    if (skuImageDto.images) {
      for (const image of skuImageDto.images) {
        const url = getImageURL(image);
        const newImage = this.productSkuImageRepo.create({
          url,
          sku: existing,
        });
        await this.productSkuImageRepo.save(newImage);
      }
    }

    return {
      message: 'Sku images uploaded',
    }
  }

  generateSkuCode(attributeOption: AttributeOption, productCode: string) {
    const brandCode = CONSTANTS.brandCode;
    const attributeValue = attributeOption.value.replaceAll(/\s+/, '_');
    const attributeCode = attributeOption.attribute.code;

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
        discount: true,
      }
    })
    if (!existing) throw new NotFoundException('Sku not found')

    return existing
  }

  async update(id: string, updateSkusDto: UpdateSkuDto) {
    const existing = await this.findOne(id);

    // PRODUCT IS NOT UPDATED IN SKU UPDATE

    const attributeOption = updateSkusDto.attributeOptionId ? await this.attributeOptionService.findOne(updateSkusDto.attributeOptionId) : existing.attributeOptions;

    Object.assign(existing, {
      price: updateSkusDto?.price ? updateSkusDto.price : existing.price,
      attributeOptions: attributeOption
    });

    return await this.skuRepo.save(existing);
  }

  async remove(id: string) {
    return `This action removes a #${id} skus`;
  }
}
