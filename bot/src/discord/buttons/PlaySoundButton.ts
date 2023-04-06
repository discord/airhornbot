import { ButtonInteraction, PermissionFlagsBits } from 'discord.js';
import { prismaClient } from '../../bot';
import { DEFAULT_AIRHORN_MAX_QUEUE_ITEMS, enqueSound, getTotalItemsInGuildQueue } from '../../utils/AirhornAudio';
import { DiscordButton } from '../types/DiscordButton';

export class PlaySoundButton extends DiscordButton {
  constructor() {
    super('play_sound', {
      version: 1,
    });
  }

  async handle(buttonInteraction: ButtonInteraction): Promise<unknown> {
    if (!buttonInteraction.member || !buttonInteraction.guildId) {
      return buttonInteraction.reply({
        content: 'You cannot trigger the bot in a direct message.',
        ephemeral: true,
      });
    }
    if (!buttonInteraction.guild) {
      return buttonInteraction.reply({
        content: 'The bot must be in the server, try to re-invite it.',
        ephemeral: true,
      });
    }
    // Get the bot member in the guild
    const botGuildMember = buttonInteraction.guild.members.me;
    if (!botGuildMember) {
      return buttonInteraction.reply({
        content: 'The bot was not found in the server.',
        ephemeral: true,
      });
    }
    const customId = JSON.parse(buttonInteraction.customId);
    let soundCommandId: number = customId.soundCommandId;
    let soundId: number | undefined = customId.soundId;
    if (!soundCommandId && !soundId) {
      return buttonInteraction.reply({
        content: 'No sound or sound command was set for this button.',
        ephemeral: true,
      });
    }
    // Find the sound variants for the command
    const soundsForSoundCommand = await prismaClient.sound.findMany({
      where: {
        soundCommandId: soundCommandId,
        disabled: false,
      },
    });
    if (soundsForSoundCommand.length === 0) {
      return buttonInteraction.reply({
        content: 'No sounds were found for the button requested.',
        ephemeral: true,
      });
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
    if (soundId !== undefined && soundId !== selectedVariant.id) {
      return buttonInteraction.reply({
        content: 'The sound requested was not found.',
        ephemeral: true,
      });
    }
    const voiceState = buttonInteraction.guild.voiceStates.cache.get(buttonInteraction.user.id);
    if (!voiceState || !voiceState.channel) {
      return buttonInteraction.reply({
        content: 'You need to be in a voice channel to run this command.',
        ephemeral: true,
      });
    }
    if (!botGuildMember.permissionsIn(voiceState.channel).has(PermissionFlagsBits.Connect)) {
      return buttonInteraction.reply({
        content: 'The bot does not have permissions to connect to the voice channel.',
        ephemeral: true,
      });
    }
    if (
      getTotalItemsInGuildQueue(buttonInteraction.guildId) >
      parseInt(process.env.AIRHORN_MAX_QUEUE_ITEMS || `${DEFAULT_AIRHORN_MAX_QUEUE_ITEMS}`, 10)
    ) {
      return buttonInteraction.reply({
        content: 'Too many items are in the queue! Try again in a moment.',
        ephemeral: true,
      });
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
