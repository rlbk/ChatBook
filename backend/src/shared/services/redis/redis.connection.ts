import Logger from 'bunyan';
import { appConfig } from '@config/appConfig';
import { BaseCache } from './base.cache';

const log: Logger = appConfig.createLogger('redis');

class RedisConnection extends BaseCache {
  constructor() {
    super('redisConection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      const res = await this.client.ping();
      log.info(res, '- Redis connected');
    } catch (error) {
      log.error(error);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
