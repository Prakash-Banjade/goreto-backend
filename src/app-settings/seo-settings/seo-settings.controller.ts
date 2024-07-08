import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SeoSettingService } from "./seo-settings.service";
import { SeoSettingsDto } from "../dto/seo-settings.dto";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";
import { Public } from "src/core/decorators/setPublicRoute.decorator";
import { Action } from "src/core/types/global.types";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";

@ApiTags('Seo Settings')
@Controller('seo-settings')
export class SeoSettingController {
    constructor(
        private readonly seoSettingService: SeoSettingService,
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ChekcAbilities({ subject: 'all', action: Action.CREATE })
    @FormDataRequest({ storage: FileSystemStoredFile, limits: { fileSize: 1024 * 1024 * 2 } })
    async set(@Body() seoSettingsDto: SeoSettingsDto) {
        return await this.seoSettingService.set(seoSettingsDto);
    }

    @Public()
    @Get()
    async get() {
        return await this.seoSettingService.get();
    }

}