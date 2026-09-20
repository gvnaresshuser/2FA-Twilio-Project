import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandTwofaOtpColumn1789804000000
  implements MigrationInterface
{
  name =
    "ExpandTwofaOtpColumn1789804000000";

  public async up(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE twofa_demo.twofa_otp_codes
      ALTER COLUMN otp TYPE VARCHAR(255);
    `);
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE twofa_demo.twofa_otp_codes
      ALTER COLUMN otp TYPE VARCHAR(6);
    `);
  }
}