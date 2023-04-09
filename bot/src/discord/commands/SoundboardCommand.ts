import { ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';
import { prismaClient } from '../../bot.js';
import { convertButtonsIntoButtonGrid } from '../../utils/InteractionUtilts.js';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand.js';

export class SoundboardCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'soundboard',
      description: 'see src/utils/RegisterCommandsUtils.ts',
      options: [
        {
          name: 'sound',
          description: 'Choose the sound.',
          type: ApplicationCommandOptionType.Integer,
        },
      ],
    });
  }

  async handle(commandInteraction: ChatInputCommandInteraction): Promise<void> {
    if (!commandInteraction.member || !commandInteraction.guildId) {
      await commandInteraction.reply({
        content: 'You cannot trigger the bot in a direct message.',
        ephemeral: true,
      });
      return;
    }
    // Get the sound command
    const soundCommand = await prismaClient.soundCommand.findFirst({
      where: {
        id: commandInteraction.options.getInteger('sound', true),
      },
    });
    if (!soundCommand) {
      await commandInteraction.reply({
        content: 'The sound command requested was not found.',
        ephemeral: true,
      });
      return;
    }
    if (soundCommand.disabled) {
      await commandInteraction.reply({
        content: 'The sound command requested is currently disabled.',
        ephemeral: true,
      });
      return;
    }
    // Find the sound variants for the command
    const soundsForSoundCommand = await prismaClient.sound.findMany({
      where: {
        soundCommandId: commandInteraction.options.getInteger('sound', true),
        disabled: false,
      },
    });
    if (soundsForSoundCommand.length === 0) {
      await commandInteraction.reply({
        content: 'No sounds were found for the command requested.',
        ephemeral: true,
      });
      return;
    }
    const buttons: ButtonBuilder[] = [];
    for (const soundVariant of soundsForSoundCommand) {
      // Determine the emoji
      let chosenEmoji = undefined;
      if (soundCommand.emoji) {
        chosenEmoji = soundCommand.emoji;
      }
      if (soundVariant.emoji) {
        chosenEmoji = soundVariant.emoji;
      }
      // Add the button to the array
      let button = new ButtonBuilder()
        .setCustomId(
          JSON.stringify({
            name: 'play_sound',
            v: 1,
            soundCommandId: soundVariant.soundCommandId,
            soundId: soundVariant.id,
          })
        )
        .setLabel(soundVariant.name)
        .setStyle(ButtonStyle.Primary);
      if (chosenEmoji) {
        button = button.setEmoji(chosenEmoji);
      }
      buttons.push(button);
    }
    await commandInteraction.reply({
      content: 'Here are the options for that sound.',
      components: convertButtonsIntoButtonGrid(buttons),
      ephemeral: false,
    });
    return;
  }
}
