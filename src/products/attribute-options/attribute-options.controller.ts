import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAttributeOptionDto } from './dto/create-attribute-option.dto';
import { UpdateAttributeOptionDto } from './dto/update-attribute-option.dto';
import { AttributeOptionService } from './attribute-options.service';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Attribute Options')
@Controller('attribute-options')
export class AttributeOptionsController {
  constructor(private readonly attributeOptionsService: AttributeOptionService) { }

  // NO NEED FOR GET ALL ROUTE

  @Post()
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createAttributeOptionDto: CreateAttributeOptionDto) {
    return this.attributeOptionsService.create(createAttributeOptionDto);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.attributeOptionsService.findOne(id);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updateAttributeOptionDto: UpdateAttributeOptionDto) {
    return this.attributeOptionsService.update(id, updateAttributeOptionDto);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id') id: string) {
    return this.attributeOptionsService.remove(id);
  }
}
