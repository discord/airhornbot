import { ChatInputCommandInteraction } from 'discord.js';
import { prismaClient } from '../../bot.js';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand.js';

export class StatsCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'stats',
      description: 'see src/utils/RegisterCommandsUtils.ts',
    });
  }

  async handle(commandInteraction: ChatInputCommandInteraction): Promise<void> {
    await commandInteraction.deferReply();
    const lines = ['**Statistics**'];
    const totalUsages = await prismaClient.usage.aggregate({
      _sum: {
        counter: true,
      },
    });
    lines.push(`**Global:** ${totalUsages._sum.counter}`);
    if (commandInteraction.inGuild()) {
      const guildUsages = await prismaClient.usage.aggregate({
        _sum: {
          counter: true,
        },
        where: {
          guildId: BigInt(commandInteraction.guildId),
        },
      });
      lines.push(`**Guild:** ${guildUsages._sum.counter}`);
    }
    const userUsages = await prismaClient.usage.aggregate({
      _sum: {
        counter: true,
      },
      where: {
        userId: BigInt(commandInteraction.user.id),
      },
    });
    lines.push(`**You:** ${userUsages._sum.counter}`);
    await commandInteraction.editReply({
      content: lines.join('\n'),
    });
    return;
  }
}
