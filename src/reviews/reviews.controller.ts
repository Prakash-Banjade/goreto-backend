import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { ReviewQueryDto } from './entities/review-query.dto';
import { CurrentUser } from 'src/core/decorators/currentuser.decorator';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @ChekcAbilities({ action: Action.UPDATE, subject: User })
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() currentUser: AuthUser) {
    return this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get()
  @ApiPaginatedResponse(CreateReviewDto)
  @ChekcAbilities({ action: Action.READ, subject: User })
  findAll(@Query() queryDto: ReviewQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.reviewsService.findAll(queryDto, currentUser);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: User })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.reviewsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: User })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @CurrentUser() currentUser: AuthUser) {
    return this.reviewsService.update(id, updateReviewDto, currentUser);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: User })
  remove(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.reviewsService.remove(id, currentUser);
  }
}
