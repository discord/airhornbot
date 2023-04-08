import { PrismaClient } from '@prisma/client';
import { ActivityType, Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { ILogObj, Logger } from 'tslog';
import { interactionCreateListener } from './discord/listeners/InteractionCreateListener.js';
import { readyListener } from './discord/listeners/ReadyListener.js';
import {
  shardDisconnectListener,
  shardReadyListener,
  shardReconnectingListener,
  shardResumeListener,
} from './discord/listeners/ShardListener.js';

export const log: Logger<ILogObj> = new Logger({
  minLevel: parseInt(process.env.MIN_LOG_LEVEL || '3', 10), // 3 is info, 2 is debug
  hideLogPositionForProduction: true,
});

// Handle all uncaught exceptions
process.on('uncaughtException', function (e) {
  log.error(e);
});

let discordShards: number[] | 'auto' = 'auto';
let discordShardCount: number | undefined = undefined;
if (process.env.DISCORD_SHARD_AUTO !== 'true') {
  discordShards = (process.env.DISCORD_SHARDS || '0').split(',').map((shardNumber) => parseInt(shardNumber, 10));
  discordShardCount = parseInt(process.env.DISCORD_SHARD_TOTAL || '1', 10);
  log.info('Not using auto sharding.');
  log.info(`  Using shards: ${discordShards.join(', ')}`);
  log.info(`  Total shards: ${discordShardCount}`);
} else {
  log.info('Using auto sharding.');
}

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  presence: {
    status: 'online',
    activities: [
      {
        type: ActivityType.Playing,
        name: process.env.DISCORD_STATUS || 'airhorn.solutions',
      },
    ],
  },
  shards: discordShards,
  shardCount: discordShardCount,
});

discordClient.on('interactionCreate', interactionCreateListener);
discordClient.on('ready', readyListener);
discordClient.on('shardReady', shardReadyListener);
discordClient.on('shardResume', shardResumeListener);
discordClient.on('shardDisconnect', shardDisconnectListener);
discordClient.on('shardReconnecting', shardReconnectingListener);

export const prismaClient = new PrismaClient();

async function main() {
  discordClient.login(process.env.DISCORD_TOKEN);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
