import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://studentdeals.uz',
      'https://studentdeals-uz.vercel.app',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(Number(port), '0.0.0.0');
}
bootstrap();
