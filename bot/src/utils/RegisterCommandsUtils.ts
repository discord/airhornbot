import { PrismaClient, SoundCommand } from '@prisma/client';
import { APIApplicationCommandOptionChoice, ApplicationCommandOptionType, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';

type SoundCommandData = {
  id: number;
  name: string;
};

export async function generateRegisterCommandsBody(prismaClient: PrismaClient): Promise<RESTPostAPIApplicationCommandsJSONBody[]> {
  const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  // Get all of the sounds that are in the database
  const sounds = await prismaClient.sound.findMany({
    where: {
      disabled: false,
    },
    include: {
      soundCommand: true,
    },
  });
  const soundCommandsMap: Map<string, SoundCommand> = new Map();
  const soundsMap: Map<string, SoundCommandData[]> = new Map();
  // Generate the list of sound commands
  for (const sound of sounds) {
    // Skip disabled sound commands
    if (sound.soundCommand.disabled) continue;
    soundCommandsMap.set(sound.soundCommand.name, sound.soundCommand);
    if (!soundsMap.has(sound.soundCommand.name)) {
      soundsMap.set(sound.soundCommand.name, []);
    }
    // Skip disabled sounds
    if (sound.disabled) continue;
    soundsMap.get(sound.soundCommand.name)?.push({
      name: sound.name,
      id: sound.id,
    });
  }
  const soundboardChoices: APIApplicationCommandOptionChoice<number>[] = [];
  // Add the dynamic sound commands
  soundCommandsMap.forEach((soundCommand) => {
    const sounds = soundsMap.get(soundCommand.name);
    if (!sounds) return;
    soundboardChoices.push({
      name: soundCommand.prettyName,
      value: soundCommand.id,
    });
    globalCommands.push({
      name: soundCommand.name,
      description: `${soundCommand.prettyName}: ${soundCommand.description}`,
      dm_permission: false,
      options: [
        {
          name: 'variant',
          description: 'Choose the sound variant.',
          required: false,
          type: ApplicationCommandOptionType.Integer,
          choices: sounds.map((sound) => {
            return {
              name: sound.name,
              value: sound.id,
            };
          }),
        },
      ],
    });
  });
  // Add the soundboard command
  globalCommands.push({
    name: 'soundboard',
    description: 'Show a soundboard for a specific sound.',
    dm_permission: false,
    options: [
      {
        name: 'sound',
        description: 'Choose the sound.',
        required: true,
        type: ApplicationCommandOptionType.Integer,
        choices: soundboardChoices,
      },
    ],
  });
  // Add the static commands after the dynamic commands
  globalCommands.push(
    ...[
      {
        name: 'invite',
        description: 'Invite AIRHORN SOLUTIONS to your server.',
      },
      {
        name: 'stats',
        description: 'View the stats for the bot.',
      },
    ]
  );
  return globalCommands;
}
