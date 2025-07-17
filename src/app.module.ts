import { Module } from '@nestjs/common';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { CategoryModule } from '@infra/iac/category.module';
import { OpenApiModule } from '@infra/openapi/openapi.module';
import { RedisModule } from '@infra/database/redis/redis.module';

@Module({
  imports: [
    PrismaModule.forRoot(),
    RedisModule.forRoot(),
    OpenApiModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
