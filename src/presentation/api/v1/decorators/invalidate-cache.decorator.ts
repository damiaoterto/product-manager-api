import { SetMetadata } from '@nestjs/common';

export const INVALIDATE_CACHE_METADATA = 'invalidate_cache_keys';

export const InvalidateCache = (...keys: string[]) =>
  SetMetadata(INVALIDATE_CACHE_METADATA, keys);
