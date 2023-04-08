import { ChatInputCommandInteraction } from 'discord.js';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand.js';

export class InviteCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'invite',
      description: 'see src/utils/RegisterCommandsUtils.ts',
    });
  }

  async handle(commandInteraction: ChatInputCommandInteraction): Promise<void> {
    const application = commandInteraction.client.application;
    // Permissions included in the url are: view channels, connect, and speak
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${application.id}&permissions=3146752&scope=applications.commands%20bot`;
    await commandInteraction.reply({
      content: `Add this bot to your server: [Click here!](${inviteLink})`,
      ephemeral: true,
    });
    return;
  }
}
