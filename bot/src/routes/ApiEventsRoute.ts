import { Prisma } from '@prisma/client';
import { EventEmitter } from 'events';
import { Request, Response } from 'express';
import { prismaClient } from '../web.js';

let counter = 0;

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(0);

async function getTotalUnique(columnName: 'userId' | 'guildId' | 'channelId'): Promise<number> {
  if (!['userId', 'guildId', 'channelId'].includes(columnName)) {
    throw new Error(`The column name was set to ${columnName} which is disallowed.`);
  }
  const totalUniqueResponse = await prismaClient.$queryRaw<
    {
      _count: number;
    }[]
  >`SELECT COUNT(DISTINCT "${Prisma.raw(columnName)}") AS "_count" FROM "Usage"`;
  return totalUniqueResponse[0]._count || 0;
}

setInterval(async () => {
  const totalGlobalCountResponse = await prismaClient.usage.aggregate({
    _sum: {
      counter: true,
    },
  });
  const totalGlobalCount = String(totalGlobalCountResponse._sum.counter || 0);
  const totalUniqueUsers = String(await getTotalUnique('userId'));
  const totalUniqueGuilds = String(await getTotalUnique('guildId'));
  const totalUniqueChannels = String(await getTotalUnique('channelId'));

  eventEmitter.emit('message', {
    id: counter++,
    event: 'message',
    data: {
      total: totalGlobalCount,
      unique_users: totalUniqueUsers,
      unique_guilds: totalUniqueGuilds,
      unique_channels: totalUniqueChannels,
      secret_count: String(0),
    },
  });
}, 1000);

export function apiEventsRouteHandler(req: Request, res: Response): unknown {
  res.setHeader('cache-control', 'no-cache');
  res.setHeader('content-type', 'text/event-stream');
  res.setHeader('access-control-allow-origin', '*');
  res.flushHeaders();

  const eventHandler = (message: { id: number; event: string; data: unknown }) => {
    res.write([`id: ${message.id}`, `event: ${message.event}`, `data: ${JSON.stringify(message.data)}`].join('\n') + '\n\n');
  };

  eventEmitter.on('message', eventHandler);

  res.on('close', () => {
    eventEmitter.off('message', eventHandler);
    res.end();
  });
  return;
}
