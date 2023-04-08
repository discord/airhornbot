import { Client, Interaction } from 'discord.js';
import { PlaySoundButton } from '../buttons/PlaySoundButton';
import { DynamicSoundCommand } from '../commands/DynamicSoundCommand';
import { InviteCommand } from '../commands/InviteCommand';
import { StatsCommand } from '../commands/StatsCommand';
import { DiscordButton } from '../types/DiscordButton';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';
import { prismaClient } from '../../bot';
import { generateRegisterCommandsBody } from '../../utils/RegisterCommandsUtils';
import { SoundboardCommand } from '../commands/SoundboardCommand';

const globalChatInputCommandMap = new Map<string, DiscordChatInputCommand>();
const buttonMap = new Map<string, DiscordButton>();

function registerGlobalChatInputCommand(discordChatInputCommand: DiscordChatInputCommand): void {
  globalChatInputCommandMap.set(discordChatInputCommand.commandConfiguration.name, discordChatInputCommand);
}

function registerButton(discordButtonCommand: DiscordButton): void {
  buttonMap.set(discordButtonCommand.name, discordButtonCommand);
}

registerGlobalChatInputCommand(new InviteCommand());
registerGlobalChatInputCommand(new SoundboardCommand());
registerGlobalChatInputCommand(new StatsCommand());

registerButton(new PlaySoundButton());

export async function interactionCreateListener(interaction: Interaction): Promise<void> {
  // Handle commands
  if (interaction.isChatInputCommand()) {
    let discordCommand = globalChatInputCommandMap.get(interaction.commandName);
    // If the command name is unknown, assume it is for a sound
    if (!discordCommand) {
      discordCommand = new DynamicSoundCommand();
    }
    if (!discordCommand) {
      return;
    }
    try {
      await discordCommand.handle(interaction);
    } catch (e) {
      console.error(`The command ${discordCommand.commandConfiguration.name} encountered an error while running.`, e);
    }
    return;
  }
  if (interaction.isButton()) {
    let customIdParsed;
    try {
      customIdParsed = JSON.parse(interaction.customId);
    } catch (e) {
      await interaction.reply({
        content: 'The button requested was invalid.',
        ephemeral: true,
      });
      return;
    }
    let discordButton = buttonMap.get(customIdParsed.name);
    if (!discordButton) {
      await interaction.reply({
        content: 'The button requested was not found.',
        ephemeral: true,
      });
      return;
    }
    if (customIdParsed.v === undefined || customIdParsed.v < discordButton.buttonConfiguration.version) {
      await interaction.reply({
        content: 'The button requested was outdated, try running the command again.',
        ephemeral: true,
      });
      return;
    }
    try {
      await discordButton.handle(interaction);
    } catch (e) {
      console.error(`The button ${discordButton.name} encountered an error while running.`, e);
    }
  }
}

export async function registerCommandsOnDiscord(client: Client<true>) {
  const globalCommands = await generateRegisterCommandsBody(prismaClient);
  await client.application.commands.set(globalCommands);
}
