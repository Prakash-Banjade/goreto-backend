import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";
import { Public } from "src/core/decorators/setPublicRoute.decorator";
import { Action } from "src/core/types/global.types";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { LocationSettingService } from "./location-settings.service";
import { LocationSettingDto } from "../dto/location-settings.dto";

@ApiTags('Location Settings')
@Controller('location-settings')
export class LocationSettingController {
    constructor(
        private readonly locationSettingService: LocationSettingService,
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ChekcAbilities({ subject: 'all', action: Action.CREATE })
    @FormDataRequest({ storage: FileSystemStoredFile })
    async set(@Body() locationSettingsDto: LocationSettingDto) {
        return await this.locationSettingService.set(locationSettingsDto);
    }

    @Public()
    @Get()
    async get() {
        return await this.locationSettingService.get();
    }

}