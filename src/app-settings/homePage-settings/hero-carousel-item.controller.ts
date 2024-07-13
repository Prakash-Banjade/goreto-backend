import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { HeroCarouselItemService } from "./hero-carousel-item.service";
import { CreateHeroCarouselItemDto } from "./dto/homePage-settings.dto";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";
import { Action } from "src/core/types/global.types";

@ApiTags('Hero Carousel Item')
@Controller('hero-carousel-items')
export class HeroCarouselItemController {
    constructor(
        private readonly heroCarouselItemService: HeroCarouselItemService
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ChekcAbilities({ subject: 'all', action: Action.CREATE })
    @FormDataRequest({ storage: FileSystemStoredFile, limits: { fileSize: 1024 * 1024 * 2, files: 1 } })
    async create(@Body() createHeroCarouselItemDto: CreateHeroCarouselItemDto) {
        return await this.heroCarouselItemService.create(createHeroCarouselItemDto);
    }

    @Get()
    @ChekcAbilities({ subject: 'all', action: Action.READ })
    async get() {
        return await this.heroCarouselItemService.findAll();
    }

    @Get(':id')
    @ChekcAbilities({ subject: 'all', action: Action.READ })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return await this.heroCarouselItemService.findOne(id);
    }

    @Patch(":id")
    @ApiConsumes('multipart/form-data')
    @ChekcAbilities({ subject: 'all', action: Action.UPDATE })
    @FormDataRequest({ storage: FileSystemStoredFile, limits: { fileSize: 1024 * 1024 * 2, files: 1 } })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateHeroCarouselItemDto: CreateHeroCarouselItemDto) {
        return await this.heroCarouselItemService.update(id, updateHeroCarouselItemDto);
    }

    @Delete(':id')
    @ChekcAbilities({ subject: 'all', action: Action.DELETE })
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return await this.heroCarouselItemService.remove(id);
    }
}