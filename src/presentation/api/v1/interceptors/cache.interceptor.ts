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
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      ctx.getHandler(),
    );

    if (!cacheKey) return next.handle();

    const request = ctx.switchToHttp().getRequest<Request>();
    const keysToInvalidate = this.reflector.get<string[]>(
      INVALIDATE_CACHE_METADATA,
      ctx.getHandler(),
    );

    try {
      const cacheData = await this.redisService.get(cacheKey);
      if (cacheData) {
        return of(cacheData);
      }
    } catch (error) {
      if (cacheKey) {
        this.logger.error(`Error on access redis: ${error}`);
        return next.handle();
      }

      if (keysToInvalidate.length) {
        this.logger.log(
          `Invaliding cache keys: ${keysToInvalidate.join(', ')}`,
        );

        const resolvedKeys = keysToInvalidate.map((key) =>
          key.replace(
            /{{(\w+)}}/g,
            (_, paramName) => request.params[paramName],
          ),
        );

        for (const key of resolvedKeys) {
          this.logger.log(`deleting key: ${key}`);
          await this.redisService.del(key);
        }
      }
    }

    this.logger.log(`Cache data not found for key ${cacheKey}`);
    return next.handle().pipe(
      tap((data) => {
        this.redisService.set(cacheKey, data).catch((error) => {
          this.logger.error(`Error on set cache key ${cacheKey}: ${error}`);
        });
      }),
    );
  }
}
