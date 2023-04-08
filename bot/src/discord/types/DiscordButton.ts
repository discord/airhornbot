import { ButtonInteraction } from 'discord.js';

export type ButtonConfigurationOptions = {
  // Version numbers older than the one listed will not work
  version: number;
};

export abstract class DiscordButton {
  public readonly name: string;
  public readonly buttonConfiguration: ButtonConfigurationOptions;

  constructor(name: string, buttonConfiguration: ButtonConfigurationOptions) {
    this.name = name;
    this.buttonConfiguration = buttonConfiguration;
  }

  abstract handle(buttonInteraction: ButtonInteraction): Promise<void>;
}
