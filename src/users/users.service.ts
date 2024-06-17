import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Not, Or, Repository } from 'typeorm';
import paginatedData from 'src/core/utils/paginatedData';
import { UserQueryDto } from './dto/user-query.dto';
import { Deleted } from 'src/core/dto/query.dto';
import getImageURL from 'src/core/utils/getImageURL';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }

  async findAll(queryDto: UserQueryDto) {
    const queryBuilder = this.queryBuilder();
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("user.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect("user.address", "address")
      .leftJoinAndSelect("user.account", "account")
      .select(["user.id", "user.phone", "user.gender", "user.dob", "user.address", "user.account", "user.createdAt", "user.updatedAt"]);

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingUser = await this.usersRepository.findOneBy({ id });
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

  private queryBuilder() {
    return this.usersRepository.createQueryBuilder('user');
  }
}
