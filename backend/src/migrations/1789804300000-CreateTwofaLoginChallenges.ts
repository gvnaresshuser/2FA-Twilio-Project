import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTwofaLoginChallenges1789804300000
  implements MigrationInterface
{
  name =
    "CreateTwofaLoginChallenges1789804300000";

  public async up(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "twofa_demo"."twofa_login_challenges" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "challenge_token" character varying(255) NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_twofa_login_challenges_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_twofa_login_challenges_token"
          UNIQUE ("challenge_token"),

        CONSTRAINT "FK_twofa_login_challenges_user_id"
          FOREIGN KEY ("user_id")
          REFERENCES "twofa_demo"."twofa_users"("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION
      )
    `);
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "twofa_demo"."twofa_login_challenges"
    `);
  }
}