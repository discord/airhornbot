import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { validateEmoji } from '../../../utils/EmojiValidator.js';
import { prismaClient } from '../../../web.js';

export const soundsRouter = express.Router();

// List sounds
soundsRouter.get(
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
    const sounds = await prismaClient.sound.findMany({
      take: 10,
      skip: offset,
    });
    res.status(200).json(sounds);
  }
);

// Add sound
soundsRouter.post('/', async (req: Request, res: Response) => {
  // Validate the body sequentually since we rely on previously validated fields for some checks (ex. name needs soundCommandId)
  const validations = [
    body('fileReference')
      .notEmpty()
      .bail()
      .custom((value: string) => {
        if (!value.startsWith('./sounds/') && !value.startsWith('http://') && !value.startsWith('http://')) {
          throw new Error();
        }
        return true;
      })
      .withMessage(`The fileReference should start with "./sounds/", "http://", or "https://".`)
      .bail()
      .custom((value: string) => {
        if (value.startsWith('http')) {
          try {
            new URL(value);
          } catch (e) {
            throw new Error();
          }
        }
        return true;
      })
      .withMessage('The url specified in the fileReference field is invalid.'),
    body('soundCommandId')
      .isInt({
        gt: 0,
      })
      .bail()
      .custom(async (value: number) => {
        const soundCommand = await prismaClient.soundCommand.findFirst({
          where: {
            id: value,
          },
        });
        if (!soundCommand) {
          throw new Error();
        }
        return true;
      })
      .withMessage('The soundCommandId is invalid.'),
    body('name')
      .notEmpty()
      .isLength({
        min: 2,
        max: 16,
      })
      .withMessage('The name should be between 2 and 16 characters inclusive.')
      .custom(async (value: string, { req }) => {
        const sound = await prismaClient.sound.findFirst({
          where: {
            name: value,
            soundCommandId: req.body.soundCommandId,
          },
        });
        if (sound) {
          throw new Error('The sound name already exists.');
        }
        return true;
      })
      .withMessage('The name already is in use on that sound command.'),
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
  // Create the sound
  const createdSound = await prismaClient.sound.create({
    data: {
      soundCommandId: req.body.soundCommandId,
      name: req.body.name,
      emoji: req.body.emoji,
      fileReference: req.body.fileReference,
    },
    include: {
      soundCommand: true,
    },
  });
  res.status(200).json(createdSound);
});

// Get sound
soundsRouter.get(
  '/:soundId',
  param('soundId').isInt({
    gt: 0,
  }),
  async (req: Request, res: Response) => {
    const soundId = parseInt(req.params.soundId, 10);
    const sound = await prismaClient.sound.findFirst({
      where: {
        id: soundId,
      },
      include: {
        soundCommand: true,
      },
    });
    const validations = [
      param('soundId')
        .custom(() => {
          if (!sound) {
            throw new Error();
          }
          return true;
        })
        .withMessage('The sound was not found.'),
    ];
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }
    res.status(200).json(sound);
  }
);

// Edit sound
soundsRouter.patch(
  '/:soundId',
  param('soundId').isInt({
    gt: 0,
  }),
  async (req: Request, res: Response) => {
    const soundId = parseInt(req.params.soundId, 10);
    const sound = await prismaClient.sound.findFirst({
      where: {
        id: soundId,
      },
    });
    // Validate the body sequentually since we rely on previously validated fields for some checks (ex. name needs soundCommandId)
    const validations = [
      param('soundId')
        .custom(() => {
          if (!sound) {
            throw new Error();
          }
          return true;
        })
        .withMessage('The sound was not found.'),
      body('fileReference')
        .optional()
        .notEmpty()
        .bail()
        .custom((value: string) => {
          if (!value.startsWith('./sounds/') && !value.startsWith('http://') && !value.startsWith('http://')) {
            throw new Error();
          }
          return true;
        })
        .withMessage(`The fileReference should start with "./sounds/", "http://", or "https://".`)
        .bail()
        .custom((value: string) => {
          if (value.startsWith('http')) {
            try {
              new URL(value);
            } catch (e) {
              throw new Error();
            }
          }
          return true;
        })
        .withMessage('The url specified in the fileReference field is invalid.'),
      body('soundCommandId')
        .optional()
        .isInt({
          gt: 0,
        })
        .bail()
        .custom(async (value: number) => {
          const soundCommand = await prismaClient.soundCommand.findFirst({
            where: {
              id: value,
            },
          });
          if (!soundCommand) {
            throw new Error();
          }
          return true;
        })
        .withMessage('The soundCommandId is invalid.'),
      body('name')
        .optional()
        .notEmpty()
        .isLength({
          min: 2,
          max: 16,
        })
        .withMessage('The name should be between 2 and 16 characters inclusive.')
        .custom(async (value: string, { req }) => {
          const foundSound = await prismaClient.sound.findFirst({
            where: {
              name: value,
              soundCommandId: req.body.soundCommandId,
            },
          });
          // Ignore if the soundCommandId and name are the same as what they were before
          if ((req.body.soundCommandId === sound?.soundCommandId || !req.body.soundCommandId) && req.body.name === sound?.name) {
            return true;
          }
          if (foundSound) {
            throw new Error('The sound name already exists.');
          }
          return true;
        })
        .withMessage('The name already is in use on that sound command.'),
      body('emoji')
        .optional()
        .bail()
        .custom(async (value: string) => {
          if (!validateEmoji(value)) {
            throw new Error('The emoji parameter must be an id or unicode emoji.');
          }
          return true;
        }),
      body('disabled').optional().bail().isBoolean({
        strict: true,
      }),
    ];
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }
    // Update the sound
    const updatedSound = await prismaClient.sound.update({
      data: {
        soundCommandId: req.body.soundCommandId,
        name: req.body.name,
        emoji: req.body.emoji,
        fileReference: req.body.fileReference,
        disabled: req.body.disabled,
      },
      include: {
        soundCommand: true,
      },
      where: {
        id: soundId,
      },
    });
    res.status(200).json(updatedSound);
  }
);
