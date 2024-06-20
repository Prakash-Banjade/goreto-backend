import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { Action } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/query.dto';

@ApiBearerAuth()
@ApiTags('Discounts')
@Controller('discounts')
export class DiscountsController {
    constructor(private readonly discountService: DiscountsService) { }

    @Post()
    @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
    create(@Body() createDiscountDto: CreateDiscountDto) {
        return this.discountService.create(createDiscountDto);
    }
    
    @Get()
    @ApiPaginatedResponse(CreateDiscountDto)
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findAll(@Query() queryDto: QueryDto) {
        return this.discountService.findAll(queryDto);
    }

    @Get(':id')
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findOne(@Param('id') id: string) {
        return this.discountService.findOne(id);
    }

    @Patch(':id')
    @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
    update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
        return this.discountService.update(id, updateDiscountDto);
    }

    @Delete(':id')
    @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
    remove(@Param('id') id: string) {
        return this.discountService.remove(id);
    }
}
