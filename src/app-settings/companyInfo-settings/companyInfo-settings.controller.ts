import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CompanyInfoSettingService } from "./companyInfo-settings.service";
import { CompanyInfoSettingsDto } from "../dto/companyInfo-settings.dto";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";

@ApiTags('CompanyInfo Settings')
@Controller('companyInfo-settings')
export class CompanyInfoSettingController {
    constructor(
        private readonly companyInfoSettingService: CompanyInfoSettingService,
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @FormDataRequest({ storage: FileSystemStoredFile })
    async set(@Body() companyInfoSettingsDto: CompanyInfoSettingsDto) {
        return await this.companyInfoSettingService.set(companyInfoSettingsDto);
    }

    @Get()
    async get() {
        return await this.companyInfoSettingService.get();
    }

}