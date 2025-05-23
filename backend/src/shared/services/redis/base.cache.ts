import { createClient } from 'redis';
import Logger from 'bunyan';
import { appConfig } from '@config/appConfig';

export type TRedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client: TRedisClient;
  log: Logger;

  constructor(cacheName: string) {
    this.client = createClient({ url: appConfig.REDIS_HOST });
    this.log = appConfig.createLogger(cacheName);
    this.cacheError();
  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => this.log.error(error));
  }
}
