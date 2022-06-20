import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from './configs/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ImagesModule } from './modules/images/images.module';
import { PexelsModule } from './shared/libs/pexels/pexels.module';
import { CloudinaryModule } from './shared/libs/cloudinary/cloudinary.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: `"Ehrlich Coding Challange" <${process.env.MAILER_SOURCE}>`,
      },
      template: {
        dir: `${process.cwd()}/src/templates/email`,
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }),
    AuthModule,
    UserModule,
    ImagesModule,
    PexelsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
