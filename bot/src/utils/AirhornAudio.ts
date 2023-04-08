import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import { log } from '../bot.js';
import { addToCounterQueue, addToRepairGuildIdQueue, addToUserQueue, CounterQueueItem, UserQueueItem } from './QueueHandler.js';

export const DEFAULT_AIRHORN_MAX_QUEUE_ITEMS = 3;

type GuildQueueItem = {
  soundFileReference: string;
  counterQueueItem: CounterQueueItem;
  userQueueItem: UserQueueItem;
};

const guildQueues: Map<string, GuildQueueItem[]> = new Map();

export function getTotalItemsInGuildQueue(guildId: string): number {
  return (guildQueues.get(guildId) || []).length;
}

async function playSound(player: AudioPlayer, soundFileReference: string): Promise<void> {
  const resource = createAudioResource(soundFileReference, {
    inputType: StreamType.Arbitrary,
  });
  player.play(resource);
  // Give it a maximum of 5 seconds to start playing, then another 5 seconds to finish
  await entersState(player, AudioPlayerStatus.Playing, 5e3);
  await entersState(player, AudioPlayerStatus.Idle, 5e3);
}

async function connectToChannel(channel: VoiceBasedChannel): Promise<VoiceConnection> {
  const connection = joinVoiceChannel({
    guildId: channel.guildId,
    channelId: channel.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    return connection;
  } catch (e) {
    connection.destroy();
    throw e;
  }
}

export async function enqueSound(
  channel: VoiceBasedChannel,
  soundFileReference: string,
  counterQueueItem: CounterQueueItem,
  userQueueItem: UserQueueItem
): Promise<void> {
  log.trace('enqueSound', {
    guildId: channel.guildId,
    channelId: channel.id,
    soundFileReference,
  });
  try {
    // If there is no queue for the guild, let's start one
    if (!guildQueues.has(channel.guildId)) {
      guildQueues.set(channel.guildId, [
        {
          soundFileReference,
          counterQueueItem,
          userQueueItem,
        },
      ]);
      const player = createAudioPlayer();
      const connection = await connectToChannel(channel);
      connection.subscribe(player);
      while ((guildQueues.get(channel.guildId) || []).length > 0) {
        // Play the queue until it is empty
        const queueItem = (guildQueues.get(channel.guildId) || []).shift();
        if (!queueItem) break;
        await playSound(player, queueItem.soundFileReference);
        // Repair the guild id
        addToRepairGuildIdQueue({
          guildId: queueItem.counterQueueItem.guildId,
          channelId: queueItem.counterQueueItem.channelId,
        });
        // Count the usage
        addToCounterQueue(queueItem.counterQueueItem);
        // Update the user information in the database
        addToUserQueue(queueItem.userQueueItem);
      }
      guildQueues.delete(channel.guildId);
      connection.disconnect();
    } else {
      // Add the item to the queue if it already exists
      guildQueues.get(channel.guildId)?.push({
        soundFileReference,
        counterQueueItem,
        userQueueItem,
      });
    }
  } catch (e) {
    log.error(e);
    // Delete the queue if we encountered an error
    guildQueues.delete(channel.guildId);
  }
}
