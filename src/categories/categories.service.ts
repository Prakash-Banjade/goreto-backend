import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import getImageURL from 'src/core/utils/getImageURL';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    // evaluate coverImage
    const coverImage = getImageURL(createCategoryDto.coverImage);
    const newCategory = this.categoriesRepo.create({
      ...createCategoryDto,
      coverImage,
    });
    return await this.categoriesRepo.save(newCategory);
  }

  async findAll() {
    return await this.categoriesRepo.find();
  }

  async findOne(id: string) {
    const existingCategory = await this.categoriesRepo.findOneBy({ id });
    if (!existingCategory) throw new Error('Category not found');

    return existingCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.findOne(id);

    // evaluate coverImage
    const coverImage = updateCategoryDto.coverImage ? getImageURL(updateCategoryDto.coverImage) : existingCategory.coverImage;
    Object.assign(existingCategory, { ...updateCategoryDto, coverImage });
    return await this.categoriesRepo.save(existingCategory);
  }

  async remove(id: string) {
    const existingCategory = await this.findOne(id);

    return await this.categoriesRepo.remove(existingCategory);
  }
}
