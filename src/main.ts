import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import 'dotenv/config'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  app.setGlobalPrefix('api');
  
  if (process.env.NODE_ENV == 'development') {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('Ehrlich 24h Code Challange API')
      .setDescription('API Documentation for Ehrlich 24h Coding Challange.')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions, {
      ignoreGlobalPrefix: false,
    });
    SwaggerModule.setup('api/docs', app, document);
  }
  
  await app.listen(process.env.APP_PORT || '0.0.0.0');
}
bootstrap();
