import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HeroCarouselItem } from "../entities/hero-carousel-item.entity";
import { Repository } from "typeorm";
import { CreateHeroCarouselItemDto, UpdateHeroCarouselItemDto } from "./dto/homePage-settings.dto";
import getImageURL from "src/core/utils/getImageURL";

@Injectable()
export class HeroCarouselItemService {
    constructor(
        @InjectRepository(HeroCarouselItem) private readonly heroCarouselItemRepo: Repository<HeroCarouselItem>,
    ) { }

    async create(heroCarouselItemDto: CreateHeroCarouselItemDto) {
        const bannerImage = getImageURL(heroCarouselItemDto.bannerImage);

        const heroCarouselItem = this.heroCarouselItemRepo.create({
            ...heroCarouselItemDto,
            bannerImage
        });
        await this.heroCarouselItemRepo.save(heroCarouselItem);

        return heroCarouselItem;
    }

    async findAll() {
        return await this.heroCarouselItemRepo.find();
    }

    async findOne(id: string) {
        const existing = await this.heroCarouselItemRepo.findOne({ where: { id } });
        if (!existing) throw new Error("Hero Carousel Item not found");

        return existing;
    }

    async update(id: string, updateHeroCarouselItemDto: UpdateHeroCarouselItemDto) {
        const existing = await this.findOne(id);

        // BANNER IMAGE
        const bannerImage = updateHeroCarouselItemDto.bannerImage ? getImageURL(updateHeroCarouselItemDto.bannerImage) : null;

        Object.assign(existing, {
            ...updateHeroCarouselItemDto,
            bannerImage
        });
        return await this.heroCarouselItemRepo.save(existing);
    }

    async remove(id: string) {
        const existing = await this.findOne(id);
        return await this.heroCarouselItemRepo.remove(existing);
    }
}