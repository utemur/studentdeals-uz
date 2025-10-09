import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://www.studentdeals.uz',
      'https://studentdeals.uz',
      'https://api.studentdeals.uz',
      'https://studentdeals-uz.vercel.app',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(Number(port), '0.0.0.0');
  
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
