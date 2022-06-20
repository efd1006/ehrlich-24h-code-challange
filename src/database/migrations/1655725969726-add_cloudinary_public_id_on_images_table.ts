import {MigrationInterface, QueryRunner} from "typeorm";

export class addCloudinaryPublicIdOnImagesTable1655725969726 implements MigrationInterface {
    name = 'addCloudinaryPublicIdOnImagesTable1655725969726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" ADD "cloudinary_public_id" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "cloudinary_public_id"`);
    }

}
