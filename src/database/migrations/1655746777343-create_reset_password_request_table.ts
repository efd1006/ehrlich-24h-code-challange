import {MigrationInterface, QueryRunner} from "typeorm";

export class createResetPasswordRequestTable1655746777343 implements MigrationInterface {
    name = 'createResetPasswordRequestTable1655746777343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reset_password_requests" ("id" SERIAL NOT NULL, "user_id" text NOT NULL, "password_reset_token" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_160a92fb6721b4085807e4936e0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reset_password_requests"`);
    }

}
