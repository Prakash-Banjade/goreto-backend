import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LocationSetting } from "../entities/location-setting.entity";
import { LocationSettingDto } from "../dto/location-settings.dto";
import { Location } from "../entities/location.entity";
import { transformAndValidateSync } from "class-transformer-validator";

@Injectable()
export class LocationSettingService {
    constructor(
        @InjectRepository(LocationSetting) private readonly locationSettingRepo: Repository<LocationSetting>,
        @InjectRepository(Location) private readonly locationRepo: Repository<Location>,
    ) { }

    async set(locationSettingsDto: LocationSettingDto) {
        const locationSetting = await this.locationSettingRepo.find();
        if (locationSetting.length > 0) {
            return await this.update(locationSettingsDto, locationSetting[0]);
        } else {
            return await this.create(locationSettingsDto);
        }
    }

    async create(locationSettingsDto: LocationSettingDto) {
        transformAndValidateSync(LocationSettingDto, locationSettingsDto); // validate dto as form data

        const locationSetting = this.locationSettingRepo.create({
            preTitle: locationSettingsDto.preTitle,
            title: locationSettingsDto.title,
            subTitle: locationSettingsDto.subTitle,
        });
        const savedLocationSetting = await this.locationSettingRepo.save(locationSetting);

        return savedLocationSetting;
    }

    async update(locationSettingsDto: LocationSettingDto, locationSetting: LocationSetting) {
        Object.assign(locationSetting, locationSettingsDto);
        const savedLocationSetting = await this.locationSettingRepo.save(locationSetting);

        return savedLocationSetting;
    }

    async get() {
        return (await this.locationSettingRepo.find())[0];
    }
}