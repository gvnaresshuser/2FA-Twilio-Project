import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTwofaUser1789802383969 implements MigrationInterface {
    name = 'CreateTwofaUser1789802383969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "twofa_demo"."twofa_users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "mobile" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d876b35d6f102d2589b2265a537" UNIQUE ("email"), CONSTRAINT "PK_d5a88ee7a52d083651185a1acfe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "twofa_demo"."twofa_users"`);
    }

}
