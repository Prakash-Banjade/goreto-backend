import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CutTypesService } from './cut-types.service';
import { CreateCutTypeDto } from './dto/create-cut-type.dto';
import { UpdateCutTypeDto } from './dto/update-cut-type.dto';
import { Action } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';

@ApiBearerAuth()
@ApiTags('Cut Types')
@Controller('cut-types')
export class CutTypesController {
  constructor(private readonly cutTypesService: CutTypesService) { }

  @Post()
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createCutTypeDto: CreateCutTypeDto) {
    return this.cutTypesService.create(createCutTypeDto);
  }

  @Public()
  @Get()
  // @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll() {
    return this.cutTypesService.findAll();
  }

  @Public()
  @Get(':id')
  // @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.cutTypesService.findOne(id);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updateCutTypeDto: UpdateCutTypeDto) {
    return this.cutTypesService.update(id, updateCutTypeDto);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id') id: string) {
    return this.cutTypesService.remove(id);
  }
}
