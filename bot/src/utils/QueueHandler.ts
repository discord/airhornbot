import Queue, { QueueWorkerCallback } from 'queue';
import { prismaClient } from '../bot.js';

const databaseQueue = new Queue({
  concurrency: 1, // This should be set to 1 to avoid race conditions
  autostart: true,
});

export type ReapirGuildIdItem = {
  guildId: string;
  channelId: string;
};

export type CounterQueueItem = {
  guildId: string;
  channelId: string;
  userId: string;
  soundId: number;
};

export type UserQueueItem = {
  userId: string;
  username: string;
  discriminator: string;
};

function reapirGuildIdItemProcess(job: ReapirGuildIdItem, callback?: QueueWorkerCallback) {
  prismaClient.usage
    .updateMany({
      where: {
        channelId: BigInt(job.channelId),
      },
      data: {
        guildId: BigInt(job.guildId),
      },
    })
    .then(() => {
      if (callback) {
        callback();
      }
    });
}

export function addToRepairGuildIdQueue(reapirGuildIdItem: ReapirGuildIdItem) {
  databaseQueue.push((callback) => {
    reapirGuildIdItemProcess(reapirGuildIdItem, callback);
  });
}

function counterQueueItemProcess(job: CounterQueueItem, callback?: QueueWorkerCallback) {
  prismaClient.usage
    .upsert({
      where: {
        guildId_channelId_userId_soundId: {
          guildId: BigInt(job.guildId),
          channelId: BigInt(job.channelId),
          userId: BigInt(job.userId),
          soundId: job.soundId,
        },
      },
      create: {
        guildId: BigInt(job.guildId),
        channelId: BigInt(job.channelId),
        user: {
          connectOrCreate: {
            where: {
              id: BigInt(job.userId),
            },
            create: {
              id: BigInt(job.userId),
              username: 'Unknown User',
              discriminator: '0000',
              lastUpdate: Math.floor(new Date().getTime() / 1000), // Current epoch time
            },
          },
        },
        sound: {
          connect: {
            id: job.soundId,
          },
        },
        counter: 1,
      },
      update: {
        counter: {
          increment: 1,
        },
      },
    })
    .then(() => {
      if (callback) {
        callback();
      }
    });
}

export function addToCounterQueue(counterQueueItem: CounterQueueItem) {
  databaseQueue.push((callback) => {
    counterQueueItemProcess(counterQueueItem, callback);
  });
}

function userQueueItemProcess(job: UserQueueItem, callback?: QueueWorkerCallback) {
  prismaClient.user
    .upsert({
      where: {
        id: BigInt(job.userId),
      },
      update: {
        username: job.username,
        discriminator: job.discriminator,
        lastUpdate: Math.floor(new Date().getTime() / 1000), // Current epoch time
      },
      create: {
        id: BigInt(job.userId),
        username: job.username,
        discriminator: job.discriminator,
        lastUpdate: Math.floor(new Date().getTime() / 1000), // Current epoch time
      },
    })
    .then(() => {
      if (callback) {
        callback();
      }
    });
}

export function addToUserQueue(userQueueItem: UserQueueItem) {
  databaseQueue.push((callback) => {
    userQueueItemProcess(userQueueItem, callback);
  });
}
