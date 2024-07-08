import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { GeneralSettingService } from "./general-settings.service";
import { GeneralSettingsDto } from "../dto/general-settings.dto";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";
import { Public } from "src/core/decorators/setPublicRoute.decorator";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { Action } from "src/core/types/global.types";

@ApiTags('General Settings')
@Controller('general-settings')
export class GeneralSettingController {
    constructor(
        private readonly generalSettingService: GeneralSettingService,
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ChekcAbilities({ subject: 'all', action: Action.CREATE })
    @FormDataRequest({ storage: FileSystemStoredFile, limits: { fileSize: 1024 * 1024 * 2, files: 2 } })
    async set(@Body() generalSettingsDto: GeneralSettingsDto) {
        return await this.generalSettingService.set(generalSettingsDto);
    }

    @Public()
    @Get()
    async get() {
        return await this.generalSettingService.get();
    }

}