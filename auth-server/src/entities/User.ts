import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true, nullable: false })
	email!: string;

	@Column({ nullable: false })
	password!: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
