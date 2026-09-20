import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTwofaOtpCode1789803802589 implements MigrationInterface {
    name = 'CreateTwofaOtpCode1789803802589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "twofa_demo"."twofa_otp_codes" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "otp" character varying(6) NOT NULL, "purpose" character varying(50) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a8767f0020011453573d2266762" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "twofa_demo"."twofa_otp_codes"`);
    }

}
