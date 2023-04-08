import { CommandInteraction, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';

export abstract class DiscordChatInputCommand {
  public readonly commandConfiguration: RESTPostAPIApplicationCommandsJSONBody;

  constructor(commandConfiguration: RESTPostAPIApplicationCommandsJSONBody) {
    this.commandConfiguration = commandConfiguration;
  }

  abstract handle(commandInteraction: CommandInteraction): Promise<void>;
}
