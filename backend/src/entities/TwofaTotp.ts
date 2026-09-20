import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  schema: "twofa_demo",
  name: "twofa_totp",
})
export class TwofaTotp {
  @PrimaryGeneratedColumn({
    type: "integer",
  })
  id!: number;

  @Column({
    name: "user_id",
    type: "integer",
    unique: true,
  })
  userId!: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  secret!: string;

  @Column({
    type: "boolean",
    default: false,
  })
  enabled!: boolean;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
  })
  updatedAt!: Date;
}