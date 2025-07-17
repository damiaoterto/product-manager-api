import { DynamicModule } from '@nestjs/common';
import {
  ConfigService as NestConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { ConfigService } from './services/config.service';
import redisConfig from './configs/redis.config';

export class ConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      imports: [NestConfigModule.forRoot({ load: [redisConfig] })],
      providers: [NestConfigService, ConfigService],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: ConfigModule,
      imports: [NestConfigModule],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
