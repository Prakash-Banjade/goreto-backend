import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CutType } from './entities/cut-type.entity';
import { CreateCutTypeDto } from './dto/create-cut-type.dto';
import { UpdateCutTypeDto } from './dto/update-cut-type.dto';

@Injectable()
export class CutTypesService {
  constructor(
    @InjectRepository(CutType) private readonly cutTypeRepo: Repository<CutType>
  ) { }
  
  async create(createCutTypeDto: CreateCutTypeDto) {
    const newCutTypeType = this.cutTypeRepo.create({
      ...createCutTypeDto,
    });
    return await this.cutTypeRepo.save(newCutTypeType);
  }

  async findAll() {
    return await this.cutTypeRepo.find();
  }

  async findOne(id: string) {
    const existingCutTypeType = await this.cutTypeRepo.findOneBy({ id });
    if (!existingCutTypeType) throw new Error('CutType type not found');

    return existingCutTypeType;
  }

  async update(id: string, updateCutTypeDto: UpdateCutTypeDto) {
    const existingCutTypeType = await this.findOne(id);

    Object.assign(existingCutTypeType, updateCutTypeDto);
    return await this.cutTypeRepo.save(existingCutTypeType);
  }

  async remove(id: string) {
    const existingCutTypeType = await this.findOne(id);

    return await this.cutTypeRepo.remove(existingCutTypeType);
  }
}
