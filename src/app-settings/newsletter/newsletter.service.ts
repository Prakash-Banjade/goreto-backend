import { InjectRepository } from "@nestjs/typeorm";
import { Newsletter } from "./entity/newsletter.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { NewsletterDto } from "./dto/newsletter.dto";

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(Newsletter) private readonly newsletterRepo: Repository<Newsletter>,
    ) { }

    async create(newsletterDto: NewsletterDto) {
        const existing = await this.newsletterRepo.findOne({ where: { email: newsletterDto.email } });
        if (existing) return {
            message: 'Subscribed',
        };
        
        const newsletter = new Newsletter();
        newsletter.email = newsletterDto.email;
        return await this.newsletterRepo.save(newsletter);
    }

    async findAll() {
        return await this.newsletterRepo.find();
    }

}