import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
// LoggingInterceptor removed - not needed

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT', 3001);
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';

  // Security
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: isDevelopment ? false : undefined,
  }));

  // Cookie parser
  app.use((cookieParser as any)(configService.get<string>('COOKIE_SECRET')));

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Global prefix and versioning
  app.setGlobalPrefix('api');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
  );

  // Swagger documentation
  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('Mates HR API')
      .setDescription('Enterprise HR Management System API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('jwt')
      .addTag('Authentication', 'User authentication and authorization')
      .addTag('Users', 'User management')
      .addTag('Employees', 'Employee management')
      .addTag('Attendance', 'Attendance tracking')
      .addTag('Leave', 'Leave management')
      .addTag('Payroll', 'Payroll processing')
      .addTag('Organization', 'Company, branches, and departments')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    });
  }

  // Health check endpoint
  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: configService.get<string>('NODE_ENV'),
    });
  });

  await app.listen(port);

  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║        🚀 MATES HR FULL SYSTEM IS RUNNING! 🚀           ║
  ║                                                          ║
  ║        API Server: http://localhost:${port}                 ║
  ║        API Docs:   http://localhost:${port}/api/docs        ║
  ║                                                          ║
  ║        ✅ All Advanced Features Enabled:                ║
  ║        • WebSocket Real-time Communication              ║
  ║        • Notifications System                           ║
  ║        • Email Service                                  ║
  ║        • Chat System                                    ║
  ║        • Projects Management                            ║
  ║        • Calendar Integration                           ║
  ║        • Screen Sharing                                 ║
  ║        • AI Analytics                                   ║
  ║                                                          ║
  ║        Login Credentials:                               ║
  ║        Admin: admin@mates-hr.com / Admin@123            ║
  ║        HR: hr@mates-hr.com / Hr@123                     ║
  ║        Employee: employee@mates-hr.com / Employee@123   ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
  `);

  console.log(`🚀 Mates HR Backend is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
