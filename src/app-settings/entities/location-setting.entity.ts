import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Location } from "./location.entity";

@Entity()
export class LocationSetting extends BaseEntity {

    @Column({ type: 'varchar', default: '' })
    preTitle: string;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'longtext' })
    subTitle: string;

    @OneToMany(() => Location, location => location.locationSetting)
    locations: Location[]
}