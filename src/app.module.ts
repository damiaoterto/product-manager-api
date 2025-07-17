import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
