import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HomePageSetting } from "../entities/homePage-setting.entity";
import { HomePageSettingsDto } from "./dto/homePage-settings.dto";

@Injectable()
export class HomePageSettingService {
    constructor(
        @InjectRepository(HomePageSetting) private readonly homePageSettingRepo: Repository<HomePageSetting>,
    ) { }

    async set(homePageSettingsDto: HomePageSettingsDto) {
        const homePageSetting = await this.homePageSettingRepo.find();
        if (homePageSetting.length > 0) {
            return await this.update(homePageSettingsDto, homePageSetting[0]);
        } else {
            return await this.create(homePageSettingsDto);
        }
    }

    async create(homePageSettingsDto: HomePageSettingsDto) {
        const homePageSetting = this.homePageSettingRepo.create({
            homeCategoriesList: homePageSettingsDto.homeCategoriesList,
        });

        return await this.homePageSettingRepo.save(homePageSetting);
    }

    async update(homePageSettingsDto: HomePageSettingsDto, homePageSetting: HomePageSetting) {

        Object.assign(homePageSetting, {
            homeCategoriesList: homePageSettingsDto.homeCategoriesList,
        });

        return await this.homePageSettingRepo.save(homePageSetting);
    }

    async get() {
        return (await this.homePageSettingRepo.find())[0];
    }
}