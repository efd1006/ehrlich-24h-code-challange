import {MigrationInterface, QueryRunner} from "typeorm";

export class createImagesTable1655724829683 implements MigrationInterface {
    name = 'createImagesTable1655724829683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "owner_id" uuid NOT NULL, "hits" integer NOT NULL DEFAULT '1', "uri" text NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "images"`);
    }

}
