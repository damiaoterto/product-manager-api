import { Module } from '@nestjs/common';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { CategoryModule } from '@infra/iac/category.module';
import { OpenApiModule } from '@infra/openapi/openapi.module';
import { RedisModule } from '@infra/database/redis/redis.module';
import { ConfigModule } from '@infra/config/config.module';
import { ProductModule } from '@infra/iac/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot(),
    RedisModule.forRoot(),
    OpenApiModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
