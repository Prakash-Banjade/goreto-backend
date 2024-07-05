import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { AttributeOption } from '../entities/attribute-option.entity';

@Injectable({ scope: Scope.REQUEST })
export class AttributeOptionsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveAttributeOption(attributeOption: AttributeOption) {
        return await this.getRepository<AttributeOption>(AttributeOption).save(attributeOption);
    }
}