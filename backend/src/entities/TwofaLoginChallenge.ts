import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({
  schema: "twofa_demo",
  name: "twofa_login_challenges",
})
export class TwofaLoginChallenge {
  @PrimaryGeneratedColumn({
    type: "integer",
  })
  id!: number;

  @Column({
    name: "user_id",
    type: "integer",
  })
  userId!: number;

  @Column({
    name: "challenge_token",
    type: "varchar",
    length: 255,
    unique: true,
  })
  challengeToken!: string;

  @Column({
    name: "expires_at",
    type: "timestamp",
  })
  expiresAt!: Date;

  @Column({
    name: "used",
    type: "boolean",
    default: false,
  })
  used!: boolean;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
  })
  createdAt!: Date;
}