import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get<T = string>(key: string): T | undefined {
    const getValue = this.nestConfigService.get(key);
    if (!getValue) return undefined;
    return getValue;
  }
}
