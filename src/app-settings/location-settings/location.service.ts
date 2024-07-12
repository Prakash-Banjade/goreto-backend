import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Location } from "../entities/location.entity";
import { CreateLocationDto } from "../dto/location-settings.dto";
import getImageURL from "src/core/utils/getImageURL";
import { LocationSettingService } from "./location-settings.service";

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location) private readonly locationRepo: Repository<Location>,
        private readonly locationSettingService: LocationSettingService
    ) { }

    async create(createLocationDto: CreateLocationDto) {
        const image = getImageURL(createLocationDto.image);
        const locationSetting = await this.locationSettingService.get();

        const location = this.locationRepo.create({
            address: createLocationDto.address,
            image,
            locationSetting,
        });

        return await this.locationRepo.save(location);
    }

    async findAll() {
        return await this.locationRepo.find();
    }

    async findOne(id: string) {
        const existing = await this.locationRepo.findOne({ where: { id } });
        if (!existing) throw new Error("Location not found");

        return existing;
    }

    async update(id: string, createLocationDto: CreateLocationDto) {
        const location = await this.findOne(id);

        const image = getImageURL(createLocationDto.image);
        Object.assign(location, {
            address: createLocationDto.address,
            image,
        });
        return await this.locationRepo.save(location);
    }

    async delete(id: string) {
        const location = await this.findOne(id);

        return await this.locationRepo.remove(location);
    }
}