import { DynamicModule } from '@nestjs/common';
import {
  ConfigService as NestConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { ConfigService } from './services/config.service';

export class ConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      imports: [NestConfigModule.forRoot()],
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
