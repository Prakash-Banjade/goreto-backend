import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { HomePageSettingService } from "./homePage-settings.service";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";
import { Public } from "src/core/decorators/setPublicRoute.decorator";
import { Action } from "src/core/types/global.types";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { HomePageSettingsDto } from "./dto/homePage-settings.dto";

@ApiTags('Home Page Settings')
@Controller('homePage-settings')
export class HomePageSettingController {
    constructor(
        private readonly homePageSettingService: HomePageSettingService,
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ChekcAbilities({ subject: 'all', action: Action.CREATE })
    @FormDataRequest({ storage: FileSystemStoredFile, limits: { fileSize: 1024 * 1024 * 2 } })
    async set(@Body() homePageSettingsDto: HomePageSettingsDto) {
        return await this.homePageSettingService.set(homePageSettingsDto);
    }

    @Public()
    @Get()
    async get() {
        return await this.homePageSettingService.get();
    }

}