import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AuthProvider, Roles } from "src/core/types/global.types";
import { BadRequestException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Account extends BaseEntity {
    @Column({ type: 'varchar' })
    firstName!: string;

    @Column({ type: 'varchar', default: '' })
    lastName?: string;

    @Column({ type: 'varchar' })
    email!: string;

    @Column({ type: 'varchar', nullable: true })
    password!: string;

    @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.CREDENTIALS })
    provider: AuthProvider;

    @Column({ type: 'enum', enum: Roles, default: Roles.USER })
    role: Roles;

    @Column({ type: 'simple-array', nullable: true })
    refresh_token: string[];

    @Column({ type: 'boolean', default: false })
    isVerified: boolean = false;

    @OneToOne(() => User, user => user.account, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn()
    user: User

    @BeforeInsert()
    hashPassword() {
        if (this.provider === AuthProvider.CREDENTIALS && !this.password) throw new BadRequestException('Password required');

        this.password = this.provider === AuthProvider.GOOGLE ? null : bcrypt.hashSync(this.password, 10);
    }

    @BeforeInsert()
    @BeforeUpdate()
    validateEmail() {
        if (!this.email) throw new BadRequestException('Email required');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(this.email)) throw new BadRequestException('Invalid email');
    }

}
