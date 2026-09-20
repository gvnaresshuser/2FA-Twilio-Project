import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTwofaSchema1760000000000
  implements MigrationInterface
{
  name = "CreateTwofaSchema1760000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS twofa_demo;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP SCHEMA IF EXISTS twofa_demo CASCADE;
    `);
  }
}