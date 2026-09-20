import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTwofaTotp1789804200000 implements MigrationInterface {
  name = "CreateTwofaTotp1789804200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "twofa_demo"."twofa_totp" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "secret" character varying(255) NOT NULL,
        "enabled" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_twofa_totp_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_twofa_totp_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_twofa_totp_user_id"
          FOREIGN KEY ("user_id")
          REFERENCES "twofa_demo"."twofa_users"("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "twofa_demo"."twofa_totp"
    `);
  }
}