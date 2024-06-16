import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";
import { Gender } from "src/core/types/global.types";

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'varchar', nullable: true })
    phone?: string;

    @Column({ type: 'enum', nullable: true })
    gender?: Gender

    @Column({ type: 'datetime', nullable: true })
    dob?: string;
}
