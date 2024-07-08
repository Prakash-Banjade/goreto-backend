import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { FaqService } from "./faq.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateFaqDto, UpdateFaqDto } from "../dto/faq.dto";
import { Public } from "src/core/decorators/setPublicRoute.decorator";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { Action } from "src/core/types/global.types";

@ApiTags('Faq')
@Controller('faqs')
export class FaqController {
    constructor(
        private readonly faqService: FaqService
    ) { }

    @Post()
    @ChekcAbilities({ subject: 'all', action: Action.CREATE })
    async create(@Body() createFaqDto: CreateFaqDto) {
        return await this.faqService.create(createFaqDto);
    }

    @Public()
    @Get()
    async findAll() {
        return await this.faqService.findAll();
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.faqService.findOne(id);
    }

    @Patch(':id')
    @ChekcAbilities({ subject: 'all', action: Action.UPDATE })
    async update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
        return await this.faqService.update(id, updateFaqDto);
    }

    @Delete(':id')
    @ChekcAbilities({ subject: 'all', action: Action.DELETE })
    async remove(@Param('id') id: string) {
        return await this.faqService.remove(id);
    }
}