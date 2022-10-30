import {redis} from "./RedisUtils";
import {configSecrets} from "./ConfigurationSecrets";

export function trackPlay(guildId: string, channelId: string, userId: string, soundName: string): void {
  // Overall
  redis.incr([configSecrets.redis.prefix, "total"].join(":"));
  // Per sound
  redis.incr([configSecrets.redis.prefix, "counts", "sound", soundName].join(":"));
  // Per user per sound
  redis.incr([configSecrets.redis.prefix, "counts", "user", userId, "sound", soundName].join(":"));
  // Per guild per sound
  redis.incr([configSecrets.redis.prefix, "counts", "guild", guildId, "sound", soundName].join(":"));
  // Per guild per channel per sound
  redis.incr([configSecrets.redis.prefix, "counts", "guild", userId, "channel", channelId, "sound", soundName].join(":"));
  // Unique guilds/channels/users
  redis.sadd([configSecrets.redis.prefix, "guilds"].join(":"), guildId);
  redis.sadd([configSecrets.redis.prefix, "channels"].join(":"), channelId);
  redis.sadd([configSecrets.redis.prefix, "users"].join(":"), userId);
}
