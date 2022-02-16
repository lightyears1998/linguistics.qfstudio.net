import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";
import {
  Field, ID, ObjectType
} from "type-graphql";

@ObjectType({ description: "用户" })
@Entity()
@Unique("UNIQUE_USERNAME", ["username"])
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  userId!: string

  @Field({ description: "用户名" })
  @Column()
  username!: string

  @Field({ description: "电子邮箱地址" })
  @Column({ default: "" })
  email!: string

  @Field({ defaultValue: "", description: "昵称" })
  @Column({ nullable: false, default: "" })
  nickname!: string

  @Column()
  passwordHash!: string

  @Column({ nullable: false, default: false })
  @Field({ defaultValue: false, description: "是否为管理员用户" })
  isAdmin!: boolean

  @Field(() => Date, { description: "注册日期" })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => Date, { description: "资料更新日期" })
  @UpdateDateColumn()
  updatedAt!: Date
}
