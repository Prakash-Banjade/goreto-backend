import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class GeneralSetting extends BaseEntity {
    @Column({ type: 'varchar', length: 255, default: '' })
    companyName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    logo: string;

    @Column({ type: 'varchar', nullable: true, })
    collapseLogo: string;

    @Column({ type: 'varchar', length: 255, default: '' })
    siteTitle: string;

    @Column({ type: 'varchar', nullable: true, default: '' })
    siteSubtitle: string;
}
