import { ActionRowBuilder, ButtonBuilder, MessageActionRowComponentBuilder } from 'discord.js';

export function convertButtonsIntoButtonGrid(buttonComponents: ButtonBuilder[]): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
  const gridComponents: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
  let i = 0;
  for (let row = 0; row < 5; row++) {
    if (row * 5 > buttonComponents.length - 1) {
      break;
    }
    gridComponents.push(new ActionRowBuilder());
    for (let column = 0; column < 5; column++) {
      if (row * 5 + column < buttonComponents.length) {
        gridComponents[row].addComponents(buttonComponents[i]);
        i++;
      }
    }
  }
  return gridComponents;
}
