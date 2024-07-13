import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "../dto/location-settings.dto";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { Action } from "src/core/types/global.types";
import { Public } from "src/core/decorators/setPublicRoute.decorator";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Locations')
@Controller('locations')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
    ) { }

    @Post()
    @ChekcAbilities({ subject: 'all', action: Action.CREATE })
    async create(@Body() createLocationDto: CreateLocationDto) {
        return await this.locationService.create(createLocationDto);
    }

    @Public()
    @Get()
    async findAll() {
        return await this.locationService.findAll();
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return await this.locationService.findOne(id);
    }

    @Patch(':id')
    @ChekcAbilities({ subject: 'all', action: Action.UPDATE })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLocationDto: CreateLocationDto) {
        return await this.locationService.update(id, updateLocationDto);
    }

    @Delete(':id')
    @ChekcAbilities({ subject: 'all', action: Action.DELETE })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return await this.locationService.delete(id);
    }

}