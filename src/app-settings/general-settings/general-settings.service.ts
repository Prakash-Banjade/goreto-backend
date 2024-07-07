import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralSetting } from "../entities/general-setting.entity";
import { Repository } from "typeorm";
import getImageURL from "src/core/utils/getImageURL";
import { GeneralSettingsDto } from "../dto/general-settings.dto";

@Injectable()
export class GeneralSettingService {
    constructor(
        @InjectRepository(GeneralSetting) private readonly generalSettingRepo: Repository<GeneralSetting>,
    ) { }

    async set(generalSettingsDto: GeneralSettingsDto) {
        const generalSetting = await this.generalSettingRepo.find();
        if (generalSetting.length > 0) {
            return await this.update(generalSettingsDto, generalSetting[0]);
        } else {
            return await this.create(generalSettingsDto);
        }
    }

    async create(generalSettingsDto: GeneralSettingsDto) {
        const logo = generalSettingsDto.logo ? getImageURL(generalSettingsDto.logo) : null;
        const collapseLogo = generalSettingsDto.collapseLogo ? getImageURL(generalSettingsDto.collapseLogo) : null;

        const generalSetting = this.generalSettingRepo.create({
            ...generalSettingsDto,
            logo,
            collapseLogo,
        });
        return await this.generalSettingRepo.save(generalSetting);
    }

    async update(generalSettingsDto: GeneralSettingsDto, generalSetting: GeneralSetting) {
        const logo = generalSettingsDto.logo ? getImageURL(generalSettingsDto.logo) : null;
        const collapseLogo = generalSettingsDto.collapseLogo ? getImageURL(generalSettingsDto.collapseLogo) : null;

        Object.assign(generalSetting, {
            ...generalSettingsDto,
            logo,
            collapseLogo,
        });
        return await this.generalSettingRepo.save(generalSetting);
    }

    async get() {
        return (await this.generalSettingRepo.find())[0];
    }
}