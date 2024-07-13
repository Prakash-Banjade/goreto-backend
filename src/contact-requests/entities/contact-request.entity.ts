import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class ContactRequest extends BaseEntity {

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: "varchar" })
    email: string;

    @Column({ type: 'longtext' })
    message: string;
}
