import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartsRepository } from './repository/carts.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
    ]),
    UsersModule,
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsRepository],
  exports: [CartsRepository, CartsService]
})
export class CartsModule { }
