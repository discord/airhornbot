import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { validateEmoji } from '../../../utils/EmojiValidator.js';
import { prismaClient } from '../../../web.js';

export const soundCommandsRouter = express.Router();

// List sound commands
soundCommandsRouter.get(
  '/',
  query('offset').optional().isInt({
    gt: 0,
  }),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const offset = parseInt((req.query.offset || '0') as string, 10);
    const soundCommands = await prismaClient.soundCommand.findMany({
      take: 10,
      skip: offset,
    });
    res.status(200).json(soundCommands);
  }
);

// Add sound command
soundCommandsRouter.post('/', async (req: Request, res: Response) => {
  // Validate the body sequentually since we rely on previously validated fields for some checks (ex. name needs soundCommandId)
  const validations = [
    body('name')
      .notEmpty()
      .isLength({
        min: 2,
        max: 16,
      })
      .withMessage('The name should be between 2 and 16 characters inclusive.')
      .isLowercase()
      .withMessage('The name should be lowercase.')
      .custom(async (value: string) => {
        const soundCommand = await prismaClient.soundCommand.findFirst({
          where: {
            name: value,
          },
        });
        if (soundCommand) {
          throw new Error('The sound command name already exists.');
        }
        return true;
      })
      .withMessage('The name already is in used for a sound command.'),
    body('prettyName')
      .notEmpty()
      .isLength({
        min: 2,
        max: 16,
      })
      .withMessage('The pretty name should be between 2 and 16 characters inclusive.'),
    body('description')
      .notEmpty()
      .isLength({
        min: 2,
        max: 48,
      })
      .withMessage('The description should be between 2 and 48 characters inclusive.'),
    body('emoji')
      .optional()
      .bail()
      .custom(async (value: string) => {
        if (!validateEmoji(value)) {
          throw new Error('The emoji parameter must be an id or unicode emoji.');
        }
        return true;
      }),
  ];
  for (const validation of validations) {
    const result = await validation.run(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
  }
  // Create the sound command
  const createdSoundCommand = await prismaClient.soundCommand.create({
    data: {
      name: req.body.name,
      prettyName: req.body.prettyName,
      description: req.body.description,
      emoji: req.body.emoji,
    },
  });
  res.status(200).json(createdSoundCommand);
});

// Get sound command
soundCommandsRouter.get(
  '/:soundCommandId',
  param('soundCommandId').isInt({
    gt: 0,
  }),
  async (req: Request, res: Response) => {
    const soundCommandId = parseInt(req.params.soundCommandId, 10);
    const soundCommand = await prismaClient.soundCommand.findFirst({
      where: {
        id: soundCommandId,
      },
    });
    const validations = [
      param('soundId')
        .custom(() => {
          if (!soundCommand) {
            throw new Error();
          }
          return true;
        })
        .withMessage('The sound command was not found.'),
    ];
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }
    res.status(200).json(soundCommand);
  }
);

// Edit sound command
soundCommandsRouter.patch(
  '/:soundCommandId',
  param('soundCommandId').isInt({
    gt: 0,
  }),
  async (req: Request, res: Response) => {
    const soundCommandId = parseInt(req.params.soundCommandId, 10);
    const soundCommand = await prismaClient.soundCommand.findFirst({
      where: {
        id: soundCommandId,
      },
    });
    // Validate the body sequentually since we rely on previously validated fields for some checks (ex. name needs soundCommandId)
    const validations = [
      param('soundId')
        .custom(() => {
          if (!soundCommand) {
            throw new Error();
          }
          return true;
        })
        .withMessage('The sound command was not found.'),
      body('name')
        .optional()
        .notEmpty()
        .isLength({
          min: 2,
          max: 16,
        })
        .withMessage('The name should be between 2 and 16 characters inclusive.')
        .isLowercase()
        .withMessage('The name should be lowercase.')
        .custom(async (value: string) => {
          const foundSoundCommand = await prismaClient.soundCommand.findFirst({
            where: {
              name: value,
            },
          });
          if (foundSoundCommand && soundCommandId !== foundSoundCommand.id) {
            throw new Error();
          }
          return true;
        })
        .withMessage('The sound command name already exists.'),
      body('prettyName')
        .optional()
        .notEmpty()
        .isLength({
          min: 2,
          max: 16,
        })
        .withMessage('The pretty name should be between 2 and 16 characters inclusive.'),
      body('description')
        .optional()
        .notEmpty()
        .isLength({
          min: 2,
          max: 48,
        })
        .withMessage('The description should be between 2 and 48 characters inclusive.'),
      body('emoji')
        .optional()
        .bail()
        .custom(async (value: string) => {
          if (!validateEmoji(value)) {
            throw new Error('The emoji parameter must be an id or unicode emoji.');
          }
          return true;
        }),
    ];
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }
    // Create the sound command
    const updatedSoundCommand = await prismaClient.soundCommand.update({
      data: {
        name: req.body.name,
        prettyName: req.body.prettyName,
        description: req.body.description,
        emoji: req.body.emoji,
        disabled: req.body.disabled,
      },
      where: {
        id: soundCommandId,
      },
    });
    res.status(200).json(updatedSoundCommand);
  }
);

// Get sounds from sound command
soundCommandsRouter.get(
  '/:soundCommandId/sounds',
  param('soundCommandId').isInt({
    gt: 0,
  }),
  query('offset').optional().isInt({
    gt: 0,
  }),
  async (req: Request, res: Response) => {
    const soundCommandId = parseInt(req.params.soundCommandId, 10);
    const soundCommand = await prismaClient.soundCommand.findFirst({
      where: {
        id: soundCommandId,
      },
    });
    const validations = [
      param('soundId')
        .custom(() => {
          if (!soundCommand) {
            throw new Error();
          }
          return true;
        })
        .withMessage('The sound command was not found.'),
    ];
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }
    const offset = parseInt((req.query.offset || '0') as string, 10);
    const sounds = await prismaClient.sound.findMany({
      take: 10,
      skip: offset,
      where: {
        soundCommandId: soundCommandId,
      },
    });
    res.status(200).json(sounds);
  }
);
