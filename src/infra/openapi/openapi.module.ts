import { Module } from '@nestjs/common';
import { OpenApiService } from './services/openapi.service';

@Module({
  providers: [OpenApiService],
  exports: [OpenApiService],
})
export class OpenApiModule {}
