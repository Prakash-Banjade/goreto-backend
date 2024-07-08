import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import getImageURL from "src/core/utils/getImageURL";
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

        const { locations, ...createLocationDto } = locationSettingsDto;
        const locationSetting = this.locationSettingRepo.create(createLocationDto);
        const savedLocationSetting = await this.locationSettingRepo.save(locationSetting);

        for (const location of locations) {
            const image = getImageURL(location.image);

            const locationEntity = this.locationRepo.create({
                ...location,
                image,
                locationSetting: savedLocationSetting,
            });
            await this.locationRepo.save(locationEntity);
        }

        return savedLocationSetting;
    }

    async update(locationSettingsDto: LocationSettingDto, locationSetting: LocationSetting) {
        const { locations, ...updateLocationDto } = locationSettingsDto;

        Object.assign(locationSetting, {
            ...updateLocationDto,
        });
        const savedLocationSetting = await this.locationSettingRepo.save(locationSetting);

        await this.locationRepo.delete({ locationSetting: { id: savedLocationSetting.id } }); // delete old locations

        for (const location of locations) {
            const image = getImageURL(location.image);
            const locationEntity = this.locationRepo.create({
                ...location,
                image,
                locationSetting: savedLocationSetting,
            });
            await this.locationRepo.save(locationEntity);
        }

        return savedLocationSetting;
    }

    async get() {
        return (await this.locationSettingRepo.find())[0];
    }
}