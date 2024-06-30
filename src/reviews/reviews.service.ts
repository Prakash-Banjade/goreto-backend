import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Between, Brackets, ILike, IsNull, Not, Or, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { AuthUser } from 'src/core/types/global.types';
import { Deleted } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { ReviewQueryDto } from './entities/review-query.dto';
import { ReviewsRepository } from './review.repository';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepo: Repository<Review>,
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) { }

  async create(createReviewDto: CreateReviewDto, currentUser: AuthUser) {
    const user = await this.usersService.findOne(currentUser.userId);
    const product = await this.productsService.findOne(createReviewDto.productSlug);

    // CHECK IF REVIEW ALREADY EXISTS
    const existingReview = await this.getProductReviewByUser(createReviewDto.productSlug, currentUser);
    if (existingReview) throw new BadRequestException('Review already exists');

    const review = this.reviewsRepo.create({
      comment: createReviewDto.comment,
      rating: createReviewDto.rating,
      user,
      product,
    });

    const savedReview = await this.reviewsRepo.save(review);

    await this.updateProductAvgRating(product.id);

    return {
      message: "Review added successfully",
      review: {
        id: savedReview.id,
        comment: savedReview.comment,
        rating: savedReview.rating,
      }
    }
  }

  private async updateProductAvgRating(productId: string) {
    const product = await this.productsRepo.findOne({
      where: { id: productId },
      relations: { reviews: true },
    });
    if (!product) throw new InternalServerErrorException('Product not found');

    const totalReviews = product.reviews.length;
    const sumRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

    product.rating = parseFloat(avgRating.toFixed(2));
    await this.productsRepo.save(product);
  }

  async getProductReviewByUser(productSlug: string, currentUser: AuthUser) {
    const review = await this.reviewsRepo.findOne({
      where: { user: { id: currentUser.userId }, product: { slug: productSlug } },
    });
    return review
  }

  async findAll(queryDto: ReviewQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.reviewsRepo.createQueryBuilder('reivew');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("reivew.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .leftJoinAndSelect("reivew.user", "user")
      .leftJoinAndSelect("reivew.product", "product")
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        queryDto.productName && qb.andWhere({ productName: ILike(`%${queryDto.productName ?? ''}%`) });

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
        user: { id: currentUser.userId },
      },
      relations: { product: true },
    })
    if (!existing) throw new BadRequestException('Review not found')

    return existing
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);

    // PRODUCT IS NOT UPDATED IN REVIEW UPDATE

    if (updateReviewDto.comment) existing.comment = updateReviewDto.comment;
    if (updateReviewDto.rating) existing.rating = updateReviewDto.rating;

    if (updateReviewDto.rating) await this.updateProductAvgRating(existing.product.id);

    return await this.reviewsRepo.save(existing);

  }

  async remove(id: string, currentUser: AuthUser) {
    const existing = await this.findOne(id, currentUser);
    await this.updateProductAvgRating(existing.product.id);

    return await this.reviewsRepo.remove(existing);
  }
}
