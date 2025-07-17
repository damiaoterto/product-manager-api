import { RedisService } from '@infra/database/redis/services/redis.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';
import { CACHE_KEY_METADATA } from '../decorators/cache-key.decorator';
import { INVALIDATE_CACHE_METADATA } from '../decorators/invalidate-cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest<Request>();

    const rawCacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      ctx.getHandler(),
    );

    const keysToInvalidate = this.reflector.get<string[]>(
      INVALIDATE_CACHE_METADATA,
      ctx.getHandler(),
    );

    const resolvePlaceholders = (key: string) =>
      key.replace(/{{(\w+)}}/g, (_, paramName) => request.params[paramName]);

    const resolvedCacheKey = rawCacheKey
      ? resolvePlaceholders(rawCacheKey)
      : undefined;

    if (resolvedCacheKey) {
      try {
        const cachedData = await this.redisService.get(resolvedCacheKey);
        if (cachedData) {
          this.logger.log(`Hit to dynamic key: ${resolvedCacheKey}`);
          return of(cachedData);
        }
      } catch (error) {
        this.logger.error('Fail on access Redis:', error);
      }
    }

    return next.handle().pipe(
      tap((data) => {
        if (resolvedCacheKey) {
          this.logger.log(`Set cache key ${resolvedCacheKey}`);
          this.redisService
            .set(resolvedCacheKey, data)
            .catch((error) => this.logger.error(error));
        }

        if (keysToInvalidate?.length) {
          const resolvedKeysToInvalidate =
            keysToInvalidate.map(resolvePlaceholders);

          for (const key of resolvedKeysToInvalidate) {
            this.logger.log(`invalidating key: ${key}`);
            this.redisService
              .del(key)
              .catch((error) => this.logger.error(error));
          }
        }
      }),
    );
  }
}
