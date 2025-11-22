import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
})
class SimpleAppModule {}

async function bootstrap() {
  const app = await NestFactory.create(SimpleAppModule);

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
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Mates HR API - Auth Only')
    .setDescription('Authentication API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = 3001;
  await app.listen(port);

  console.log(`
  ╔════════════════════════════════════════════════════╗
  ║                                                    ║
  ║     🚀 MATES HR AUTH SERVER IS RUNNING! 🚀        ║
  ║                                                    ║
  ║     API Server: http://localhost:${port}              ║
  ║     API Docs:   http://localhost:${port}/api/docs     ║
  ║                                                    ║
  ║     Test Login:                                    ║
  ║     Email: admin@mates-hr.com                     ║
  ║     Password: Admin@123                            ║
  ║                                                    ║
  ╚════════════════════════════════════════════════════╝
  `);
}

bootstrap();
