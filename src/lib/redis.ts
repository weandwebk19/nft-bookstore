import { redisConfig } from "@config/redis";
import Redis, { RedisOptions } from "ioredis";

function getRedisConfiguration(): {
  port: number | undefined;
  host: string | undefined;
  password: string | undefined;
  user: string | undefined;
} {
  return redisConfig;
}

let redisInstance: Redis | null = null;

export function getRedisInstance(config = getRedisConfiguration()) {
  try {
    if (!redisInstance) {
      const options: RedisOptions = {
        host: config.host,
        lazyConnect: true,
        showFriendlyErrorStack: true,
        enableAutoPipelining: true,
        maxRetriesPerRequest: 0,
        retryStrategy: (times: number) => {
          if (times > 3) {
            throw new Error(
              `[Redis] Could not connect after ${times} attempts`
            );
          }

          return Math.min(times * 200, 1000);
        }
      };

      if (config.port) {
        options.port = config.port;
      }

      if (config.password) {
        options.password = config.password;
      }
      redisInstance = new Redis(options);
      redisInstance.on("connect", function () {
        console.log("Redis plugged in.");
      });
      redisInstance.on("error", (error: unknown) => {
        console.warn("[Redis] Error connecting", error);
      });
    }
    return redisInstance;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}
