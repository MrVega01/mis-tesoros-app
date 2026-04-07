import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis

  constructor (private config: ConfigService) {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
      password: this.config.get<string>('REDIS_PASSWORD') || undefined
    })
  }

  async get (key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async set (key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds)
    } else {
      await this.client.set(key, value)
    }
  }

  async del (key: string): Promise<void> {
    await this.client.del(key)
  }

  async keys (pattern: string): Promise<string[]> {
    return this.client.keys(pattern)
  }

  onModuleDestroy () {
    this.client.disconnect()
  }
}
