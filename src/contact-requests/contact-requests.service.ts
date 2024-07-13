import { Injectable } from '@nestjs/common';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactRequest } from './entities/contact-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactRequestsService {
  constructor(
    @InjectRepository(ContactRequest) private readonly contactRequestRepo: Repository<ContactRequest>,
  ) { }

  async create(createContactRequestDto: CreateContactRequestDto) {
    const contactRequest = this.contactRequestRepo.create(createContactRequestDto);
    return await this.contactRequestRepo.save(contactRequest);
  }

  async findAll() {
    return await this.contactRequestRepo.find();
  }
}
