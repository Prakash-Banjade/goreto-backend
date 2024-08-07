import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsRepository } from './review.repository';
import { Product } from 'src/products/entities/product.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Product,
      OrderItem,
    ])
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule { }
