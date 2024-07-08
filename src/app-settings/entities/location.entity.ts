import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { LocationSetting } from "./location-setting.entity";

@Entity()
export class Location extends BaseEntity {
    @Column({ type: 'varchar' })
    address: string;

    @Column({ type: 'varchar' })
    image: string;

    @ManyToOne(() => LocationSetting, locationSetting => locationSetting.locations)
    locationSetting: LocationSetting
}