import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CaslModule } from 'src/casl/casl.module';
import { UsersRepository } from './repository/user.repository';
import { Account } from 'src/accounts/entities/account.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Account
    ]),
    CaslModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule { }
