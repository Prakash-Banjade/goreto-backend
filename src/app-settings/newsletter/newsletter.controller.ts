import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NewsletterService } from "./newsletter.service";
import { NewsletterDto } from "./dto/newsletter.dto";

@ApiTags('Newsletter')
@Controller('newsletters')
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) { }

    @Post()
    async create(@Body() newsletterDto: NewsletterDto) {
        return await this.newsletterService.create(newsletterDto);
    }

    @Get()
    async findAll() {
        return await this.newsletterService.findAll();
    }
}