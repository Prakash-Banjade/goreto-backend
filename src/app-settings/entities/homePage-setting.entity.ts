import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class HomePageSetting extends BaseEntity {
    @Column({ type: 'simple-array' })
    homeCategoriesList: string[]
}