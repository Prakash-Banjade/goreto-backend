import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreparationsService } from './preparations.service';
import { CreatePreparationDto } from './dto/create-preparation.dto';
import { UpdatePreparationDto } from './dto/update-preparation.dto';
import { Action } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';

@ApiBearerAuth()
@Controller('Preparations')
@Controller('preparations')
export class PreparationsController {
  constructor(private readonly preparationsService: PreparationsService) { }

  @Post()
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createPreparationDto: CreatePreparationDto) {
    return this.preparationsService.create(createPreparationDto);
  }

  @Public()
  @Get()
  // @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll() {
    return this.preparationsService.findAll();
  }

  @Public()
  @Get(':id')
  // @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.preparationsService.findOne(id);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updatePreparationDto: UpdatePreparationDto) {
    return this.preparationsService.update(id, updatePreparationDto);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id') id: string) {
    return this.preparationsService.remove(id);
  }
}
