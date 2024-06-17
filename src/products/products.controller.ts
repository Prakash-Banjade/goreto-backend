import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { ProductQueryDto } from './dto/product-query.dto';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(CreateProductDto)
  findAll(@Query() queryDto: ProductQueryDto) {
    return this.productsService.findAll(queryDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Post('deleteMany')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Body('ids') ids: string) {
    return this.productsService.remove(JSON.parse(ids));
  }

  @Post('restoreMany')
  @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
  @HttpCode(HttpStatus.OK)
  restore(@Body('ids') ids: string) {
    return this.productsService.restore(JSON.parse(ids));
  }

  @Post('emptyTrash')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  emptyTrash() {
    return this.productsService.clearTrash();
  }
}
