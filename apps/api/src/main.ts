// Import this first!
import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  // Use Pino logger
  app.useLogger(app.get(Logger));
  app.flushLogs();

  // Trust proxy (for Render/Cloudflare)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Helmet security headers with PWA support
  // CSP disabled - handled by frontend (Next.js)
  // This allows PWA service workers to work with blob: and self
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'same-origin' },
    contentSecurityPolicy: false,
  }));

  // Compression
  app.use(compression());
  
  // CORS - Allow production, staging, and development domains
  const allowedOrigins = [
    // Production
    'https://studentdeals.uz',
    'https://www.studentdeals.uz',
    // Staging
    'https://staging.studentdeals.uz',
    'https://studentdeals-uz-staging.vercel.app',
    // Development
    /^https?:\/\/localhost:\d+$/, // localhost with any port
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // Check if origin matches allowed patterns
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return origin === allowed;
        }
        // RegExp pattern
        return allowed.test(origin);
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true, // Allow credentials for auth
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Swagger API Documentation (optional, only in development)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('StudentDeals API')
      .setDescription('StudentDeals Uzbekistan API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(Number(port), '0.0.0.0');
  
  console.log(`🚀 API running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
  }
  
  return app;
}

// For local development
if (require.main === module) {
  bootstrap();
}

// For Vercel serverless
export default async (req: any, res: any) => {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};
