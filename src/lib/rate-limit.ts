import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), 
  prefix: "ratelimit:auth",
});

export const taskRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "15 m"),
  prefix: "ratelimit:tasks",
});