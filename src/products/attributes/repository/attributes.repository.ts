import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Attribute } from '../entities/attribute.entity';

@Injectable({ scope: Scope.REQUEST })
export class AttributesRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveAttribute(attribute: Attribute) {
        return await this.getRepository<Attribute>(Attribute).save(attribute);
    }
}