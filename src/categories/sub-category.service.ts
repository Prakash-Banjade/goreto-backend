import { BadRequestException, Injectable } from '@nestjs/common';
import { Brackets, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import getImageURL from 'src/core/utils/getImageURL';
import { generateSlug } from 'src/core/utils/generateSlug';
import paginatedData from 'src/core/utils/paginatedData';
import { SubCategory } from './entities/sub-category.entity';
import { CreateSubCategoryDto } from './dto/create-category.dto';
import { SubCategoryQueryDto } from './dto/sub-category-query.dto';
import { UpdateSubCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@Injectable()
export class SubCategoriesService {
    constructor(
        @InjectRepository(SubCategory) private readonly subSubCategoryRepo: Repository<SubCategory>,
        private readonly categoryService: CategoriesService,
    ) { }

    async create(createSubCategoryDto: CreateSubCategoryDto) {
        const existingSubCategory = await this.subSubCategoryRepo.findOneBy({ subCategoryName: createSubCategoryDto.subCategoryName });
        if (existingSubCategory) throw new BadRequestException('SubCategory already exists');

        // evaluate category
        const category = await this.categoryService.findOne(createSubCategoryDto.categorySlug);

        // evaluate coverImage
        const coverImage = getImageURL(createSubCategoryDto.coverImage);

        const slug = generateSlug(createSubCategoryDto.subCategoryName);

        const newSubCategory = this.subSubCategoryRepo.create({
            ...createSubCategoryDto,
            coverImage,
            slug,
            category,
        });
        return await this.subSubCategoryRepo.save(newSubCategory);
    }

    async findAll(queryDto: SubCategoryQueryDto) {
        const queryBuilder = this.subSubCategoryRepo.createQueryBuilder('subCategory');

        queryBuilder
            .orderBy("subCategory.createdAt", queryDto.order)
            .leftJoinAndSelect("subCategory.subCategories", "subSubCategory")
            .andWhere(new Brackets(qb => {
                qb.where([
                    { subCategoryName: ILike(`%${queryDto.search ?? ''}%`) },
                ]);
            }))

        return paginatedData(queryDto, queryBuilder);
    }

    async findOne(slug: string) {
        const existingSubCategory = await this.subSubCategoryRepo.findOne({
            where: { slug },
            relations: { category: true }
        });
        if (!existingSubCategory) throw new Error('SubCategory not found');

        return existingSubCategory;
    }

    async update(slug: string, updateSubCategoryDto: UpdateSubCategoryDto) {
        const existingSubCategory = await this.findOne(slug);

        // evaluate coverImage
        const coverImage = updateSubCategoryDto.coverImage ? getImageURL(updateSubCategoryDto.coverImage) : existingSubCategory.coverImage;
        Object.assign(existingSubCategory, { ...updateSubCategoryDto, coverImage });
        return await this.subSubCategoryRepo.save(existingSubCategory);
    }

    async remove(slug: string) {
        const existingSubCategory = await this.findOne(slug);

        return await this.subSubCategoryRepo.remove(existingSubCategory);
    }
}
