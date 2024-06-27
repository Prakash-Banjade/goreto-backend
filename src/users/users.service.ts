import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Not, Or, Repository } from 'typeorm';
import paginatedData from 'src/core/utils/paginatedData';
import { UserQueryDto } from './dto/user-query.dto';
import { Deleted } from 'src/core/dto/query.dto';
import getImageURL from 'src/core/utils/getImageURL';
import { AuthUser } from 'src/core/types/global.types';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }

  async findAll(queryDto: UserQueryDto) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("user.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect("user.account", "account")
      .leftJoinAndSelect("user.address", "address")
      .leftJoinAndSelect("user.shippingAddresses", "shippingAddresses")

    return paginatedData(queryDto, queryBuilder);
  }

  async myDetails(currentUser: AuthUser) {
    return await this.findOne(currentUser.userId);
  }

  async findOne(id: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
      relations: {
        cart: {
          cartItems: true,
        },
        account: true,
      }
    });
    if (!existingUser) throw new NotFoundException('User not found');

    return existingUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);

    // evaluate profile image
    const image = updateUserDto.image ? getImageURL(updateUserDto.image) : existingUser.image;

    // update user
    Object.assign(existingUser, {
      ...updateUserDto,
      image,
    });

    return await this.usersRepository.save(existingUser);
  }

  async remove(id: string) {
    const existingUser = await this.findOne(id);
    await this.usersRepository.softRemove(existingUser);

    return {
      message: 'User removed',
    }
  }
}
