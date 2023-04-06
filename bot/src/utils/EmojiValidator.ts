import { getEmojis } from 'unicode-emoji';

export function validateEmoji(emoji: string): boolean {
  const validDiscordId = /^\d{17,21}$/g;
  if (emoji.match(validDiscordId)) {
    return true;
  }
  if (getEmojis().filter((value) => value.emoji === emoji).length !== 0) {
    return true;
  }
  return false;
}
