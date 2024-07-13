import { Module } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { ContactRequestsController } from './contact-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactRequest } from './entities/contact-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactRequest])
  ],
  controllers: [ContactRequestsController],
  providers: [ContactRequestsService],
})
export class ContactRequestsModule { }
