import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { Action } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';

@ApiTags('Contact Requests')
@Controller('contact-requests')
export class ContactRequestsController {
  constructor(private readonly contactRequestsService: ContactRequestsService) { }

  @Public()
  @Post()
  @ChekcAbilities({ subject: 'all', action: Action.CREATE })
  create(@Body() createContactRequestDto: CreateContactRequestDto) {
    return this.contactRequestsService.create(createContactRequestDto);
  }

  @Get()
  @ChekcAbilities({ subject: 'all', action: Action.READ })
  findAll() {
    return this.contactRequestsService.findAll();
  }
}
