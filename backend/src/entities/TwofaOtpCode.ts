import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({
  name: "twofa_otp_codes",
  schema: "twofa_demo",
})
export class TwofaOtpCode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "user_id",
    type: "integer",
  })
  userId!: number;

  @Column({
    type: "varchar",
    length: 6,
  })
  otp!: string;

  @Column({
    type: "varchar",
    length: 50,
  })
  purpose!: string;

  @Column({
    name: "expires_at",
    type: "timestamp",
  })
  expiresAt!: Date;

  @Column({
    type: "boolean",
    default: false,
  })
  verified!: boolean;

  @Column({ type: "integer", default: 0 })
  attempts!: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
  })
  createdAt!: Date;
}