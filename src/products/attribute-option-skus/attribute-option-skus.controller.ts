import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributeOptionSkusService } from './attribute-option-skus.service';
import { CreateAttributeOptionSkusDto } from './dto/create-attribute-option-skus.dto';
import { UpdateAttributeOptionSkusDto } from './dto/update-attribute-option-skus.dto';

@Controller('attribute-option-skus')
export class AttributeOptionSkusController {
  constructor(private readonly attributeOptionSkusService: AttributeOptionSkusService) {}

  @Post()
  create(@Body() createAttributeOptionSkusDto: CreateAttributeOptionSkusDto) {
    return this.attributeOptionSkusService.create(createAttributeOptionSkusDto);
  }

  @Get()
  findAll() {
    return this.attributeOptionSkusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeOptionSkusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeOptionSkusDto: UpdateAttributeOptionSkusDto) {
    return this.attributeOptionSkusService.update(id, updateAttributeOptionSkusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeOptionSkusService.remove(id);
  }
}
