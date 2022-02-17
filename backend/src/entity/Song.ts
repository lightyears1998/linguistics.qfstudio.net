import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";

@ObjectType()
@Entity()
@Unique("UNIQUE_neteaseMusicId", ["neteaseMusicId"])
export class Song {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  songId!: string

  @Field(() => ID)
  @Column({ nullable: true, default: null })
  neteaseMusicId?: string

  @Field(() => String)
  @Column({ nullable: false, default: "" })
  lyrics!: string

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date
}
