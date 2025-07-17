import { SetMetadata } from '@nestjs/common';

export const INVALIDATE_CACHE_METADATA = 'invalidateCacheKeys';

export const InvalidateCache = (...keys: string[]) =>
  SetMetadata(INVALIDATE_CACHE_METADATA, keys);
