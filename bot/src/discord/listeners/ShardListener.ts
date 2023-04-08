import { CloseEvent } from 'discord.js';
import { log } from '../../bot.js';

export function shardReadyListener(shardId: number): void {
  log.info(`Shard ID ${shardId} is ready.`);
}

export function shardResumeListener(shardId: number): void {
  log.info(`Shard ID ${shardId} has resumed.`);
}

export function shardDisconnectListener(_closeEvent: CloseEvent, shardId: number): void {
  log.info(`Shard ID ${shardId} has disconnected.`);
}

export function shardReconnectingListener(shardId: number): void {
  log.info(`Shard ID ${shardId} is reconnecting.`);
}
