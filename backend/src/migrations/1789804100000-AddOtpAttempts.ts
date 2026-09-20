import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpAttempts1789804100000
  implements MigrationInterface
{
  name = "AddOtpAttempts1789804100000";

  public async up(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE twofa_demo.twofa_otp_codes
      ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;
    `);
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE twofa_demo.twofa_otp_codes
      DROP COLUMN attempts;
    `);
  }
}