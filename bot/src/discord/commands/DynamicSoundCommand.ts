import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageActionRowComponentBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { prismaClient } from '../../bot';
import { DEFAULT_AIRHORN_MAX_QUEUE_ITEMS, enqueSound, getTotalItemsInGuildQueue } from '../../utils/AirhornAudio';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class DynamicSoundCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'dynamicsound',
      description: 'see src/utils/RegisterCommandsUtils.ts',
      options: [
        {
          name: 'variant',
          description: 'Choose the sound variant.',
          type: ApplicationCommandOptionType.Integer,
        },
      ],
    });
  }

  async handle(commandInteraction: ChatInputCommandInteraction): Promise<unknown> {
    if (!commandInteraction.member || !commandInteraction.guildId) {
      return commandInteraction.reply({
        content: 'You cannot trigger the bot in a direct message.',
        ephemeral: true,
      });
    }
    if (!commandInteraction.guild) {
      return commandInteraction.reply({
        content: 'The bot must be in the server, try to re-invite it.',
        ephemeral: true,
      });
    }
    // Get the bot member in the guild
    const botGuildMember = commandInteraction.guild.members.me;
    if (!botGuildMember) {
      return commandInteraction.reply({
        content: 'The bot was not found in the server.',
        ephemeral: true,
      });
    }
    // Find the sound command
    const soundCommand = await prismaClient.soundCommand.findFirst({
      where: {
        name: commandInteraction.commandName,
      },
    });
    if (!soundCommand) {
      return commandInteraction.reply({
        content: 'No sound was found for this command.',
        ephemeral: true,
      });
    }
    if (soundCommand.disabled) {
      return commandInteraction.reply({
        content: 'The sound command requested is disabled.',
        ephemeral: true,
      });
    }
    // Find the sound variants for the command
    const soundsForSoundCommand = await prismaClient.sound.findMany({
      where: {
        soundCommandId: soundCommand.id,
        disabled: false,
      },
    });
    if (soundsForSoundCommand.length === 0) {
      return commandInteraction.reply({
        content: 'No sounds were found for the command requested.',
        ephemeral: true,
      });
    }
    let selectedVariant = soundsForSoundCommand[Math.floor(Math.random() * soundsForSoundCommand.length)];
    // Check to see if a sound variant is specified (if it is, set the selected variant to the correct one)
    const variantOption = commandInteraction.options.getInteger('variant', false);
    if (variantOption !== null) {
      const foundVariant = soundsForSoundCommand.filter((sound) => sound.id === variantOption)[0] || undefined;
      if (foundVariant) {
        selectedVariant = foundVariant;
      }
    }
    // If it is disabled or missing
    if (variantOption !== null && variantOption !== selectedVariant.id) {
      return commandInteraction.reply({
        content: 'The sound requested was not found.',
        ephemeral: true,
      });
    }
    const voiceState = commandInteraction.guild.voiceStates.cache.get(commandInteraction.user.id);
    if (!voiceState || !voiceState.channel) {
      return commandInteraction.reply({
        content: 'You need to be in a voice channel to run this command.',
        ephemeral: true,
      });
    }
    if (!botGuildMember.permissionsIn(voiceState.channel).has(PermissionFlagsBits.Connect)) {
      return commandInteraction.reply({
        content: 'The bot does not have permissions to connect to the voice channel.',
        ephemeral: true,
      });
    }
    if (
      getTotalItemsInGuildQueue(commandInteraction.guildId) >
      parseInt(process.env.AIRHORN_MAX_QUEUE_ITEMS || `${DEFAULT_AIRHORN_MAX_QUEUE_ITEMS}`, 10)
    ) {
      return commandInteraction.reply({
        content: 'Too many items are in the queue! Try again in a moment.',
        ephemeral: true,
      });
    }
    // Queue the sound to play in the guild
    enqueSound(
      voiceState.channel,
      selectedVariant.fileReference,
      {
        guildId: commandInteraction.guildId,
        channelId: voiceState.channel.id,
        userId: commandInteraction.user.id,
        soundId: selectedVariant.id,
      },
      {
        userId: commandInteraction.user.id,
        username: commandInteraction.user.username,
        discriminator: commandInteraction.user.discriminator,
      }
    );
    // Get the emoji to use for the command
    let chosenEmoji = undefined;
    if (soundCommand.emoji) {
      chosenEmoji = soundCommand.emoji;
    }
    if (selectedVariant.emoji) {
      chosenEmoji = selectedVariant.emoji;
    }
    let button = new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          name: 'play_sound',
          v: 1,
          soundCommandId: selectedVariant.soundCommandId,
          soundId: selectedVariant.id,
        })
      )
      .setLabel('Replay')
      .setStyle(ButtonStyle.Primary);
    if (chosenEmoji) {
      button = button.setEmoji(chosenEmoji);
    }
    const actionRow = new ActionRowBuilder().addComponents([button]) as ActionRowBuilder<MessageActionRowComponentBuilder>;
    // Respond to the interaction
    await commandInteraction.reply({
      content: `Dispatching sound...`,
      components: [actionRow],
      ephemeral: false,
    });
    return;
  }
}
