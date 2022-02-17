import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";

@Entity()
@Unique("UNIQUE_neteaseMusicId", ["neteaseMusicId"])
export class Song {
  @PrimaryGeneratedColumn("increment")
  songId!: string

  @Column({ nullable: true, default: null })
  neteaseMusicId?: string

  @Column({ nullable: false, default: "" })
  lyrics!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
