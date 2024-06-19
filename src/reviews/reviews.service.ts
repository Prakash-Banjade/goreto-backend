import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Between, Brackets, ILike, IsNull, Not, Or, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { AuthUser } from 'src/core/types/global.types';
import { Deleted, QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { ReviewQueryDto } from './entities/review-query.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepo: Repository<Review>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) { }

  async create(createReviewDto: CreateReviewDto, currentUser: AuthUser) {
    console.log(createReviewDto)
    const user = await this.usersService.findOne(currentUser.userId);
    const product = await this.productsService.findOne(createReviewDto.productId);

    const review = this.reviewsRepo.create({
      comment: createReviewDto.comment,
      rating: createReviewDto.rating,
      user,
      product,
    });

    return this.reviewsRepo.save(review);
  }

  async findAll(queryDto: ReviewQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.reviewsRepo.createQueryBuilder('reivew');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("reivew.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .leftJoinAndSelect("reivew.user", "user")
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        // qb.where([
        //   { reivewName: ILike(`%${queryDto.search ?? ''}%`) },
        // ]);
        qb.andWhere("user.id = :userId", { userId: currentUser.userId });
        if ((queryDto.ratingFrom && queryDto.ratingTo) && !queryDto.rating && queryDto.ratingFrom < queryDto.ratingTo)
          qb.andWhere({ rating: Between(queryDto.ratingFrom, queryDto.ratingTo) });
        if (queryDto.rating) qb.andWhere({ rating: queryDto.rating });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: AuthUser) {
    const existing = await this.reviewsRepo.findOne({
      where: {
        id,
        user: { id: currentUser.userId }
      }
    })
    if (!existing) throw new BadRequestException('Review not found')

    return existing
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    // PRODUCT IS NOT UPDATED IN REVIEW UPDATE

    if (updateReviewDto.comment) existing.comment = updateReviewDto.comment;
    if (updateReviewDto.rating) existing.rating = updateReviewDto.rating;

    return await this.reviewsRepo.save(existing);

  }

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    return await this.reviewsRepo.remove(existing);
  }
}
