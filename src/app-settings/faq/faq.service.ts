import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Faq } from "../entities/faq.entity";
import { CreateFaqDto, UpdateFaqDto } from "../dto/faq.dto";
import { BadRequestException } from "@nestjs/common";

export class FaqService {

    constructor(
        @InjectRepository(Faq) private readonly faqRepo: Repository<Faq>,
    ) { }

    async create(createFaqDto: CreateFaqDto) {
        return await this.faqRepo.save(createFaqDto);
    }

    async findAll() {
        return await this.faqRepo.find();
    }

    async findOne(id: string) {
        const existing = await this.faqRepo.findOne({ where: { id } });
        if (!existing) throw new BadRequestException('FAQ not found');

        return existing;
    }

    async update(id: string, updateFaqDto: UpdateFaqDto) {
        const existing = await this.findOne(id);

        Object.assign(existing, updateFaqDto);
        return await this.faqRepo.save(existing);
    }

    async remove(id: string) {
        const existing = await this.findOne(id);
        return await this.faqRepo.remove(existing);
    }
}