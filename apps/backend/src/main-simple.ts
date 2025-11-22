import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Mates HR API')
    .setDescription('Enterprise HR Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║     🚀 MATES HR BACKEND IS RUNNING! 🚀       ║
  ║                                               ║
  ║     API Server: http://localhost:${port}        ║
  ║     API Docs:   http://localhost:${port}/api/docs  ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
}

bootstrap();
