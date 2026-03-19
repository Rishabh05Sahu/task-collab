import { redis } from "./redis";

export async function publishEvent(event: any) {
  await redis.publish("tasks", JSON.stringify(event));
}