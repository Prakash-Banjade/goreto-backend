import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable({ scope: Scope.REQUEST })
export class AccountsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async insert(account: Account) {
        return await this.getRepository(Account).save(account);
    }
}