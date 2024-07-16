import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Newsletter extends BaseEntity {
    @Column({type: 'varchar'})
    email: string
}