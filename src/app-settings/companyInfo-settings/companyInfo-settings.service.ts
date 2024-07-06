import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CompanyInfoSettingsDto } from "../dto/companyInfo-settings.dto";
import { CompanyInfoSetting } from "../entities/companyInfo-entity";

@Injectable()
export class CompanyInfoSettingService {
    constructor(
        @InjectRepository(CompanyInfoSetting) private readonly companyInfoSettingRepo: Repository<CompanyInfoSetting>,
    ) { }

    async set(companyInfoSettingsDto: CompanyInfoSettingsDto) {
        const companyInfoSetting = await this.companyInfoSettingRepo.find();
        if (companyInfoSetting.length > 0) {
            return await this.update(companyInfoSettingsDto, companyInfoSetting[0]);
        } else {
            return await this.create(companyInfoSettingsDto);
        }
    }

    async create(companyInfoSettingsDto: CompanyInfoSettingsDto) {
        const companyInfoSetting = this.companyInfoSettingRepo.create({
            ...companyInfoSettingsDto,
            socialProfiles: JSON.stringify(companyInfoSettingsDto.socialProfiles),
        });
        return await this.companyInfoSettingRepo.save(companyInfoSetting);
    }

    async update(companyInfoSettingsDto: CompanyInfoSettingsDto, companyInfoSetting: CompanyInfoSetting) {
        Object.assign(companyInfoSetting, {
            ...companyInfoSettingsDto,
            socialProfiles: JSON.stringify(companyInfoSettingsDto.socialProfiles),
        });
        return await this.companyInfoSettingRepo.save(companyInfoSetting);
    }

    async get() {
        return (await this.companyInfoSettingRepo.find())[0];
    }
}