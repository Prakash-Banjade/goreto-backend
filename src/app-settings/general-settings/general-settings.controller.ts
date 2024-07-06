import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { GeneralSettingService } from "./general-settings.service";
import { GeneralSettingsDto } from "../dto/general-settings.dto";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";

@ApiTags('General Settings')
@Controller('general-settings')
export class GeneralSettingController {
    constructor(
        private readonly generalSettingService: GeneralSettingService,
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({ storage: FileSystemStoredFile, limits: { fileSize: 1024 * 1024 * 2, files: 2 } })
    async set(@Body() generalSettingsDto: GeneralSettingsDto) {
        return await this.generalSettingService.set(generalSettingsDto);
    }

    @Get()
    async get() {
        return await this.generalSettingService.get();
    }

}