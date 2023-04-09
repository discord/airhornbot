import { ButtonInteraction, PermissionFlagsBits } from 'discord.js';
import { prismaClient } from '../../bot.js';
import { DEFAULT_AIRHORN_MAX_QUEUE_ITEMS, enqueSound, getTotalItemsInGuildQueue } from '../../utils/AirhornAudio.js';
import { DiscordButton } from '../types/DiscordButton.js';

export class PlaySoundButton extends DiscordButton {
  constructor() {
    super('play_sound', {
      version: 1,
    });
  }

  async handle(buttonInteraction: ButtonInteraction): Promise<void> {
    if (!buttonInteraction.member || !buttonInteraction.guildId) {
      await buttonInteraction.reply({
        content: 'You cannot trigger the bot in a direct message.',
        ephemeral: true,
      });
      return;
    }
    if (!buttonInteraction.guild) {
      await buttonInteraction.reply({
        content: 'The bot must be in the server, try to re-invite it.',
        ephemeral: true,
      });
      return;
    }
    // Get the bot member in the guild
    const botGuildMember = buttonInteraction.guild.members.me;
    if (!botGuildMember) {
      await buttonInteraction.reply({
        content: 'The bot was not found in the server.',
        ephemeral: true,
      });
      return;
    }
    const customId = JSON.parse(buttonInteraction.customId);
    const soundCommandId: number = customId.soundCommandId;
    const soundId: number | undefined = customId.soundId;
    if (!soundCommandId && !soundId) {
      await buttonInteraction.reply({
        content: 'No sound or sound command was set for this button.',
        ephemeral: true,
      });
      return;
    }
    // Find the sound variants for the command
    const soundsForSoundCommand = await prismaClient.sound.findMany({
      where: {
        soundCommandId: soundCommandId,
        disabled: false,
      },
    });
    if (soundsForSoundCommand.length === 0) {
      await buttonInteraction.reply({
        content: 'No sounds were found for the button requested.',
        ephemeral: true,
      });
      return;
    }
    let selectedVariant = soundsForSoundCommand[Math.floor(Math.random() * soundsForSoundCommand.length)];
    // Check to see if a sound variant is specified (if it is, set the selected variant to the correct one)
    if (soundId) {
      const foundVariant = soundsForSoundCommand.filter((sound) => sound.id === soundId)[0] || undefined;
      if (foundVariant) {
        selectedVariant = foundVariant;
      }
    }
    // If it is disabled or missing
    if (!soundId && soundId !== selectedVariant.id) {
      await buttonInteraction.reply({
        content: 'The sound requested was not found.',
        ephemeral: true,
      });
      return;
    }
    const voiceState = buttonInteraction.guild.voiceStates.cache.get(buttonInteraction.user.id);
    if (!voiceState || !voiceState.channel) {
      await buttonInteraction.reply({
        content: 'You need to be in a voice channel to run this command.',
        ephemeral: true,
      });
      return;
    }
    if (!botGuildMember.permissionsIn(voiceState.channel).has(PermissionFlagsBits.Connect)) {
      await buttonInteraction.reply({
        content: 'The bot does not have permissions to connect to the voice channel.',
        ephemeral: true,
      });
      return;
    }
    if (
      getTotalItemsInGuildQueue(buttonInteraction.guildId) >
      parseInt(process.env.AIRHORN_MAX_QUEUE_ITEMS || `${DEFAULT_AIRHORN_MAX_QUEUE_ITEMS}`, 10)
    ) {
      await buttonInteraction.reply({
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
        guildId: buttonInteraction.guildId,
        channelId: voiceState.channel.id,
        userId: buttonInteraction.user.id,
        soundId: selectedVariant.id,
      },
      {
        userId: buttonInteraction.user.id,
        username: buttonInteraction.user.username,
        discriminator: buttonInteraction.user.discriminator,
      }
    );
    await buttonInteraction.deferUpdate();
  }
}
