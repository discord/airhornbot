import { Routes } from 'discord.js';
import express, { Request, Response } from 'express';
import { generateRegisterCommandsBody } from '../../../utils/RegisterCommandsUtils.js';
import { discordApplicationInformation, discordRestClient, log, prismaClient } from '../../../web.js';

export const registerCommandsRouter = express.Router();

// View register commands body
registerCommandsRouter.get('/', async (_req: Request, res: Response) => {
  const commands = await generateRegisterCommandsBody(prismaClient);
  res.status(200).json(commands);
});

// Register the commands
registerCommandsRouter.post('/', async (_req: Request, res: Response) => {
  if (!discordApplicationInformation) {
    return;
  }
  const commands = await generateRegisterCommandsBody(prismaClient);
  try {
    const apiResponse = await discordRestClient.put(Routes.applicationCommands(discordApplicationInformation.id), {
      body: commands,
    });
    res.status(200).json({
      message: 'Commands registered.',
      responseFromDiscord: apiResponse,
    });
  } catch (e) {
    log.error(e);
    res.status(500).json({
      message: 'An error occurred, please check the logs.',
    });
  }
});
