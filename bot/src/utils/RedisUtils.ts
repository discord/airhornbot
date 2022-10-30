import Redis from "ioredis";
import {configSecrets} from "./ConfigurationSecrets";

export const redis = new Redis({
  host: configSecrets.redis.host,
  port: configSecrets.redis.port,
  password: configSecrets.redis.password
});

export async function getAllKeysScan(pattern: string): Promise<string[]> {
  const stream = redis.scanStream({
    match: pattern
  });
  const foundKeys: Set<string> = new Set<string>();
  stream.on("data", (resultKeys) => {
    for (let i = 0; i < resultKeys.length; i++) {
      if (foundKeys.has(resultKeys[i])) {
        continue;
      }
      foundKeys.add(resultKeys[i]);
    }
  });
  await new Promise<void>(resolve => {
    stream.on("end", () => {
      resolve();
    });
  });
  return [...foundKeys.values()];
}

export async function getCountForKey(key: string): Promise<number> {
  const result = await redis.get(key);
  if (!result) {
    return 0;
  }
  return Number(result);
}

export async function getCountForSetKey(key: string): Promise<number> {
  return redis.scard(key);
}

export async function sumOfKeys(pattern: string): Promise<number> {
  const foundKeys = await getAllKeysScan(pattern);
  let sum = 0;
  for (let i = 0; i < foundKeys.length; i++) {
    sum += await getCountForKey(foundKeys[i]);
  }
  return sum;
}
