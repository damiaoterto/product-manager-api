import { Module } from '@nestjs/common';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { CategoryModule } from '@infra/iac/category.module';

@Module({
  imports: [PrismaModule.forRoot(), CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
