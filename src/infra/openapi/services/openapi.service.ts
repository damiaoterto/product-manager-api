import { INestApplication, Injectable } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from 'node:process';

@Injectable()
export class OpenApiService {
  init(app: INestApplication) {
    if (env.NODE_ENV === 'production') return;

    const config = new DocumentBuilder().setTitle('Product Manager').build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('swagger', app, documentFactory);
  }
}
