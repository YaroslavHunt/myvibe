import * as argon2 from 'argon2';
import { CreationOptional, InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize';
import { BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from 'sequelize-typescript';



@Table({
	tableName: 'users',
	timestamps: false,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: true, fields: ['email'] },
		{ unique: true, fields: ['username'] }
	]
})
export default class User extends Model<
	InferAttributes<User>,
	InferCreationAttributes<User>
> {
	@Column({
		type: DataType.UUID,
		defaultValue: UUIDV4,
		primaryKey: true,
		unique: true
	})
	declare id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	username: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	password: string;

	@Column({
		type: DataType.STRING,
		allowNull: true
	})
	picture?: string;

	@Column({
		field: 'created_at',
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW
	})
	declare createdAt: CreationOptional<Date>;

	@Column({
		field: 'updated_at',
		type: DataType.DATE,
		allowNull: true
	})
	declare updatedAt: CreationOptional<Date>;

	@BeforeUpdate
	static setUpdatedAt(instance: User) {
		instance.updatedAt = new Date();
	}

	@BeforeCreate
	@BeforeUpdate
	static async hashPassword(user: User) {
		if (user.changed('password') && user.password) {
			user.password = await argon2.hash(user.password);
		}
	}
}