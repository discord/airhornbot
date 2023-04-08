import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageActionRowComponentBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { prismaClient } from '../../bot.js';
import { DEFAULT_AIRHORN_MAX_QUEUE_ITEMS, enqueSound, getTotalItemsInGuildQueue } from '../../utils/AirhornAudio.js';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand.js';

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

  async handle(commandInteraction: ChatInputCommandInteraction): Promise<void> {
    if (!commandInteraction.member || !commandInteraction.guildId) {
      await commandInteraction.reply({
        content: 'You cannot trigger the bot in a direct message.',
        ephemeral: true,
      });
      return;
    }
    if (!commandInteraction.guild) {
      await commandInteraction.reply({
        content: 'The bot must be in the server, try to re-invite it.',
        ephemeral: true,
      });
      return;
    }
    // Get the bot member in the guild
    const botGuildMember = commandInteraction.guild.members.me;
    if (!botGuildMember) {
      await commandInteraction.reply({
        content: 'The bot was not found in the server.',
        ephemeral: true,
      });
      return;
    }
    // Find the sound command
    const soundCommand = await prismaClient.soundCommand.findFirst({
      where: {
        name: commandInteraction.commandName,
      },
    });
    if (!soundCommand) {
      await commandInteraction.reply({
        content: 'No sound was found for this command.',
        ephemeral: true,
      });
      return;
    }
    if (soundCommand.disabled) {
      await commandInteraction.reply({
        content: 'The sound command requested is disabled.',
        ephemeral: true,
      });
      return;
    }
    // Find the sound variants for the command
    const soundsForSoundCommand = await prismaClient.sound.findMany({
      where: {
        soundCommandId: soundCommand.id,
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
    let selectedVariant = soundsForSoundCommand[Math.floor(Math.random() * soundsForSoundCommand.length)];
    // Check to see if a sound variant is specified (if it is, set the selected variant to the correct one)
    const variantOption = commandInteraction.options.getInteger('variant', false);
    if (!variantOption) {
      const foundVariant = soundsForSoundCommand.filter((sound) => sound.id === variantOption)[0] || undefined;
      if (foundVariant) {
        selectedVariant = foundVariant;
      }
    }
    // If it is disabled or missing
    if (!variantOption && variantOption !== selectedVariant.id) {
      await commandInteraction.reply({
        content: 'The sound requested was not found.',
        ephemeral: true,
      });
      return;
    }
    const voiceState = commandInteraction.guild.voiceStates.cache.get(commandInteraction.user.id);
    if (!voiceState || !voiceState.channel) {
      await commandInteraction.reply({
        content: 'You need to be in a voice channel to run this command.',
        ephemeral: true,
      });
      return;
    }
    if (!botGuildMember.permissionsIn(voiceState.channel).has(PermissionFlagsBits.Connect)) {
      await commandInteraction.reply({
        content: 'The bot does not have permissions to connect to the voice channel.',
        ephemeral: true,
      });
      return;
    }
    if (
      getTotalItemsInGuildQueue(commandInteraction.guildId) >
      parseInt(process.env.AIRHORN_MAX_QUEUE_ITEMS || `${DEFAULT_AIRHORN_MAX_QUEUE_ITEMS}`, 10)
    ) {
      await commandInteraction.reply({
        content: 'Too many items are in the queue! Try again in a moment.',
        ephemeral: true,
      });
      return;
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
