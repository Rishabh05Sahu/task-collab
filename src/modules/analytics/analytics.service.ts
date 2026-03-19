import { redis } from "@/lib/redis";
import { getAnalyticsSummaryFromDB } from "./analytics.repository";

const CACHE_KEY = "analytics:summary";

export async function getAnalyticsSummary() {
  // 1️⃣ Check cache
  const cached = await redis.get(CACHE_KEY);

  if (cached) {
    return cached;
  }

  // 2️⃣ Compute from DB
  const data = await getAnalyticsSummaryFromDB();

  // 3️⃣ Store in Redis with TTL (60s)
  await redis.set(CACHE_KEY, data, { ex: 60 });

  return data;
}

export async function invalidateAnalyticsCache() {
  await redis.del(CACHE_KEY);
}