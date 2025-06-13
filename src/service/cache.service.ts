import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private cachedKeys: string[] = [];

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<unknown> {
    return this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.cachedKeys.push(key);
    await this.cacheManager.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    this.cachedKeys = this.cachedKeys.filter((k) => k !== key);
    await this.cacheManager.del(key);
  }

  async deleteAll(key: string): Promise<void> {
    const toDelete = this.cachedKeys.filter((k) => k.startsWith(key));
    for (const key of toDelete) {
      this.cachedKeys = this.cachedKeys.filter((k) => k !== key);
      await this.cacheManager.del(key);
    }
  }

  getCacheKeys(): Array<string> {
    return this.cachedKeys;
  }
}
