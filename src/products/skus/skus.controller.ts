import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SkusService } from './skus.service';
import { CreateSkuDto, SkuImageDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@ApiTags('SKU')
@Controller('skus')
export class SkusController {
  constructor(private readonly skusService: SkusService) { }

  @Post()
  create(@Body() createSkusDto: CreateSkuDto) {
    return this.skusService.create(createSkusDto);
  }

  @Post(':id/upload')
  @FormDataRequest({ storage: FileSystemStoredFile })
  uploadSkuImages(@Param('id', ParseUUIDPipe) id: string, @Body() uploadSkuImageDto: SkuImageDto) {
    return this.skusService.uploadSkuImages(id, uploadSkuImageDto);
  }

  @Get()
  findAll() {
    return this.skusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.skusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSkusDto: UpdateSkuDto) {
    return this.skusService.update(id, updateSkusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.skusService.remove(id);
  }
}
