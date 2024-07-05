import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { Attribute } from './entities/attribute.entity';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AttributeOptionService } from '../attribute-options/attribute-options.service';
import { AttributeOption } from '../attribute-options/entities/attribute-option.entity';
import { AttributesRepository } from './repository/attributes.repository';
import { AttributeOptionsRepository } from '../attribute-options/repository/attribute-options.reposityr';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute) private readonly attributeRepo: Repository<Attribute>,
    @InjectRepository(AttributeOption) private readonly attributeOptionRepo: Repository<AttributeOption>,
    private readonly attributesRepository: AttributesRepository,
    private readonly attributeOptionsRepository: AttributeOptionsRepository,
  ) { }

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const existing = await this.attributeRepo.findOne({
      where: [
        { name: createAttributeDto.name },
        { code: createAttributeDto.code }
      ]
    });
    if (existing) throw new ConflictException('Attribute with same name or code already exists');

    const attribute = this.attributeRepo.create(createAttributeDto);
    const savedAttribute = await this.attributesRepository.saveAttribute(attribute);

    if (createAttributeDto.options?.length) {
      for (const option of createAttributeDto.options) {
        const attributeOption = this.attributeOptionRepo.create({
          ...option,
          attribute: savedAttribute,
        });
        await this.attributeOptionsRepository.saveAttributeOption(attributeOption);
      }
    }

    return savedAttribute;
  }

  async findAll(): Promise<Attribute[]> {
    return await this.attributeRepo.find();
  }

  async findOne(id: string): Promise<Attribute> {
    const existing = await this.attributeRepo.findOne({
      where: { id },
      relations: {
        attributeOptions: true
      }
    });
    if (!existing) throw new BadRequestException('Attribute not found');
    return existing;
  }

  async update(id: string, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
    const existing = await this.findOne(id);
    Object.assign(existing, updateAttributeDto);
    return await this.attributeRepo.save(existing);
  }

  async remove(id: string): Promise<Attribute> {
    const existing = await this.findOne(id);
    return await this.attributeRepo.remove(existing);
  }
}
