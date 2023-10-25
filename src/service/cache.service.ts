import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private cachedKeys: string[] = [];

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<unknown> {
    return this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.cachedKeys.push(key);
    return this.cacheManager.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    this.cachedKeys = this.cachedKeys.filter((k) => k !== key);
    return this.cacheManager.del(key);
  }

  async deleteAll(key: string): Promise<void> {
    const toDelete = this.cachedKeys.filter((k) => k.startsWith(key));
    toDelete.forEach((key) => {
      this.cachedKeys = this.cachedKeys.filter((k) => k !== key);
      this.cacheManager.del(key);
    });
  }

  async getCacheKeys(): Promise<string[]> {
    return this.cachedKeys;
  }
}
