import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeOptionDto } from './dto/create-attribute-option.dto';
import { AttributeOption } from './entities/attribute-option.entity';
import { AttributeService } from '../attributes/attributes.service';
import { UpdateAttributeOptionDto } from './dto/update-attribute-option.dto';
import { AttributeOptionsRepository } from './repository/attribute-options.reposityr';

@Injectable()
export class AttributeOptionService {
  constructor(
    @InjectRepository(AttributeOption) private readonly attributeOptionRepo: Repository<AttributeOption>,
    private readonly attributeService: AttributeService,
  ) { }

  async create(createAttributeOptionDto: CreateAttributeOptionDto): Promise<AttributeOption> {
    const existing = await this.attributeOptionRepo.findOne({ where: [
      { value: createAttributeOptionDto.value, attribute: { id: createAttributeOptionDto.attributeId } },
      { meta: createAttributeOptionDto.meta, attribute: { id: createAttributeOptionDto.attributeId } },
    ] });
    if (existing) throw new BadRequestException('Attribute option with same value or meta already exists');

    const attribute = await this.attributeService.findOne(createAttributeOptionDto.attributeId);

    const attributeOption = this.attributeOptionRepo.create({
      ...createAttributeOptionDto,
      attribute,
    });

    return await this.attributeOptionRepo.save(attributeOption);
  }

  // NO NEED FOR FIND ALL OPTION

  async findOne(id: string): Promise<AttributeOption> {
    const existing = await this.attributeOptionRepo.findOne({ where: { id }, relations: { attribute: true } });
    if (!existing) throw new BadRequestException('Attribute option not found');

    return existing;
  }

  async update(id: string, updateAttributeOptionDto: UpdateAttributeOptionDto): Promise<AttributeOption> {
    const existing = await this.findOne(id);

    // ATTRIBUTE CAN'T BE CHANGED FOR THE OPTION

    Object.assign(existing, updateAttributeOptionDto);
    return await this.attributeOptionRepo.save(existing);
  }

  async remove(id: string): Promise<AttributeOption> {
    const existing = await this.findOne(id);

    return await this.attributeOptionRepo.remove(existing);
  }
}
