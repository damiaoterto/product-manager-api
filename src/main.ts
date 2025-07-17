import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { OpenApiService } from '@infra/openapi/services/openapi.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const openApiService = app.get(OpenApiService);

  openApiService.init(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
