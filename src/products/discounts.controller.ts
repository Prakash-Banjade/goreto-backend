import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';

@ApiBearerAuth()
@ApiTags('Discounts')
@Controller('discounts')
export class DiscountsController {
    constructor(private readonly discountService: DiscountsService) { }

    @Post()
    create(@Body() createDiscountDto: CreateDiscountDto) {
        return this.discountService.create(createDiscountDto);
    }

    @Get()
    findAll() {
        return this.discountService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.discountService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
        return this.discountService.update(id, updateDiscountDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.discountService.remove(id);
    }
}
