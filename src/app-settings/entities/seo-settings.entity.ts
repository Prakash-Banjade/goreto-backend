import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class SeoSetting extends BaseEntity {
    @Column({ type: 'varchar', length: 255, default: '' })
    metaTitle: string;

    @Column({ type: 'longtext' })
    metaDescription: string;

    @Column({ type: 'varchar', default: '' })
    canonicalUrl: string;

    @Column({ type: 'varchar', length: 255, default: '' })
    ogTitle: string;

    @Column({ type: 'longtext' })
    ogDescription: string;

    @Column({ type: 'varchar', nullable: true })
    ogImage: string;

    @Column({ type: 'varchar', default: '' })
    twitterUsername: string;
}
