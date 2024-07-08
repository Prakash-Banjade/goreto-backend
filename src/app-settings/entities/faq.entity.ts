import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Faq extends BaseEntity {

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'longtext' })
    description: string;
}