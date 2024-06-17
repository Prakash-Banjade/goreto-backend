import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Preparation } from './entities/preparation.entity';
import { CreatePreparationDto } from './dto/create-preparation.dto';
import { UpdatePreparationDto } from './dto/update-preparation.dto';

@Injectable()
export class PreparationsService {
  constructor(
    @InjectRepository(Preparation) private readonly preparationTypesRepo: Repository<Preparation>
  ) { }

  async create(createPreparationDto: CreatePreparationDto) {
    const newPreparationType = this.preparationTypesRepo.create({
      ...createPreparationDto,
    });
    return await this.preparationTypesRepo.save(newPreparationType);
  }

  async findAll() {
    return await this.preparationTypesRepo.find();
  }

  async findOne(id: string) {
    const existingPreparationType = await this.preparationTypesRepo.findOneBy({ id });
    if (!existingPreparationType) throw new Error('Preparation type not found');

    return existingPreparationType;
  }

  async update(id: string, updatePreparationDto: UpdatePreparationDto) {
    const existingPreparationType = await this.findOne(id);

    Object.assign(existingPreparationType, updatePreparationDto);
    return await this.preparationTypesRepo.save(existingPreparationType);
  }

  async remove(id: string) {
    const existingPreparationType = await this.findOne(id);

    return await this.preparationTypesRepo.remove(existingPreparationType);
  }
}
