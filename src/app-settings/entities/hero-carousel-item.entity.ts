import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class HeroCarouselItem extends BaseEntity {
    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'longtext', nullable: true })
    subTitle: string;

    @Column({ type: 'varchar' })
    actionLabel: string;

    @Column({ type: 'varchar' })
    actionUrl: string;

    @Column({ type: 'varchar', nullable: true })
    bannerImage: string;
}