export const redisConfig = {
  host: process.env.NEXT_PUBLIC_REDIS_HOST,
  password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
  port: parseInt(process.env.NEXT_PUBLIC_REDIS_PORT!),
  user: process.env.NEXT_PUBLIC_REDIS_USER
};
