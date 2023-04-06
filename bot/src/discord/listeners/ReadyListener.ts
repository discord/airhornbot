import { Client } from 'discord.js';
import { log } from '../../bot';
import { registerCommandsOnDiscord } from './InteractionCreateListener';

export async function readyListener(clientObject: Client<true>): Promise<void> {
  log.info(`Logged in as ${clientObject.user.tag} (${clientObject.user.id}).`);
  if (process.env.REGISTER_DISCORD_COMMANDS === 'true') {
    log.info('Registering commands on Discord.');
    await registerCommandsOnDiscord(clientObject);
  }
}
