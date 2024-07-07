import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import getImageURL from "src/core/utils/getImageURL";
import { SeoSettingsDto } from "../dto/seo-settings.dto";
import { SeoSetting } from "../entities/seo-settings.entity";

@Injectable()
export class SeoSettingService {
    constructor(
        @InjectRepository(SeoSetting) private readonly seoSettingRepo: Repository<SeoSetting>,
    ) { }

    async set(seoSettingsDto: SeoSettingsDto) {
        const seoSetting = await this.seoSettingRepo.find();
        if (seoSetting.length > 0) {
            return await this.update(seoSettingsDto, seoSetting[0]);
        } else {
            return await this.create(seoSettingsDto);
        }
    }

    async create(seoSettingsDto: SeoSettingsDto) {
        const ogImage = seoSettingsDto.ogImage ? getImageURL(seoSettingsDto.ogImage) : null;

        const seoSetting = this.seoSettingRepo.create({
            ...seoSettingsDto,
            ogImage,
        });
        return await this.seoSettingRepo.save(seoSetting);
    }

    async update(seoSettingsDto: SeoSettingsDto, seoSetting: SeoSetting) {
        const ogImage = seoSettingsDto.ogImage ? getImageURL(seoSettingsDto.ogImage) : null;

        Object.assign(seoSetting, {
            ...seoSettingsDto,
            ogImage,
        });
        return await this.seoSettingRepo.save(seoSetting);
    }

    async get() {
        return (await this.seoSettingRepo.find())[0];
    }
}