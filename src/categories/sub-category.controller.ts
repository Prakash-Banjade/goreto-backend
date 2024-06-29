import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-category.dto';
import { UpdateSubCategoryDto } from './dto/update-category.dto';
import { Action } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { SubCategoriesService } from './sub-category.service';
import { SubCategoryQueryDto } from './dto/sub-category-query.dto';

@ApiBearerAuth()
@ApiTags('Sub Category')
@Controller('sub-categories')
export class SubCategoryController {
    constructor(private readonly subCategoryService: SubCategoriesService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
    @FormDataRequest({ storage: FileSystemStoredFile })
    create(@Body() createSubCategoryDtop: CreateSubCategoryDto) {
        return this.subCategoryService.create(createSubCategoryDtop);
    }

    @Public()
    @Get()
    // @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findAll(@Query() queryDto: SubCategoryQueryDto) {
        return this.subCategoryService.findAll(queryDto);
    }

    @Public()
    @Get(':slug')
    // @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findOne(@Param('slug') slug: string) {
        return this.subCategoryService.findOne(slug);
    }

    @Patch(':slug')
    @ApiConsumes('multipart/form-data')
    @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
    @FormDataRequest({ storage: FileSystemStoredFile })
    update(@Param('slug') slug: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
        return this.subCategoryService.update(slug, updateSubCategoryDto);
    }

    @Delete(':slug')
    @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
    remove(@Param('slug') slug: string) {
        return this.subCategoryService.remove(slug);
    }
}
