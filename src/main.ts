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

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
bootstrap();
