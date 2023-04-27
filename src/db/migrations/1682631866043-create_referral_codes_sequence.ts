import { MigrationInterface, QueryRunner } from 'typeorm';

export class createReferralCodesSequence1682631866043
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE referral_codes
      START 100000
      INCREMENT 1;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP SEQUENCE referral_codes;
    `);
  }
}
