import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Action } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { CategoryQueryDto } from './dto/category-query.dto';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  // @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll(@Query() queryDto: CategoryQueryDto) {
    return this.categoriesService.findAll(queryDto);
  }

  @Public()
  @Get(':slug')
  // @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  @Patch(':slug')
  @ApiConsumes('multipart/form-data')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('slug') slug: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(slug, updateCategoryDto);
  }

  @Delete(':slug')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('slug') slug: string) {
    return this.categoriesService.remove(slug);
  }
}
