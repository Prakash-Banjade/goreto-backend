import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { Attribute } from './entities/attribute.entity';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute) private readonly attributeRepo: Repository<Attribute>
  ) { }

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const existing = await this.attributeRepo.findOne({ where: [
      { name: createAttributeDto.name },
      { code: createAttributeDto.code }
    ] });
    if (existing) throw new ConflictException('Attribute with same name or code already exists');

    const attribute = this.attributeRepo.create(createAttributeDto);
    return await this.attributeRepo.save(attribute);
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
