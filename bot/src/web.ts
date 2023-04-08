import { PrismaClient } from '@prisma/client';
import { REST, RESTGetAPIOAuth2CurrentApplicationResult, Routes } from 'discord.js';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { Server as HttpServer } from 'http';
import { ILogObj, Logger } from 'tslog';
import { apiAdminRouter } from './routes/ApiAdminRouter.js';
import { apiEventsRouteHandler } from './routes/ApiEventsRoute.js';

export const log: Logger<ILogObj> = new Logger({
  minLevel: parseInt(process.env.MIN_LOG_LEVEL || '3', 10), // 3 is info, 2 is debug
  hideLogPositionForProduction: true,
});

// Handle all uncaught exceptions
process.on('uncaughtException', function (e) {
  log.error(e);
});

// Create the Discord REST client
export const discordRestClient = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
export let discordApplicationInformation: RESTGetAPIOAuth2CurrentApplicationResult | undefined = undefined;

export const expressApplication = express();
expressApplication.disable('x-powered-by');
const httpServer: HttpServer = new HttpServer(expressApplication);
// A little bit of fun (John Wick is a great movie)
expressApplication.use(function (_, res: Response, next: NextFunction) {
  res.setHeader('x-powered-by', 'Airhorns...lots of airhorns');
  next();
});
expressApplication.use(express.json());

expressApplication.get('/api/events', apiEventsRouteHandler);
expressApplication.use('/api/admin', apiAdminRouter);

if (process.env.WEB_HOST_STATIC === 'true') {
  expressApplication.use(express.static(process.env.WEB_HOST_STATIC_DIRECTORY || '../website/build'));
}

expressApplication.use((_, res: Response) => {
  res.status(404).header('content-type', 'text/plain').send('404: Not Found');
});
expressApplication.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  log.error(err.stack);
  res.status(500).header('content-type', 'text/plain').send('500: Internal Server Error');
});

export const prismaClient = new PrismaClient();

async function main() {
  discordApplicationInformation = (await discordRestClient.get(
    Routes.oauth2CurrentApplication()
  )) as RESTGetAPIOAuth2CurrentApplicationResult;
  log.info(`Using Discord application ${discordApplicationInformation.name} (${discordApplicationInformation.id}).`);
  const portToListenOn = parseInt(process.env.WEB_PORT || '3000', 10);
  httpServer.listen(portToListenOn, () => {
    log.info(`Web server is now listening on ${portToListenOn}.`);
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
