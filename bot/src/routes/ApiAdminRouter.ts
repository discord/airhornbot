import express, { NextFunction, Request, Response } from 'express';
import { soundsRouter } from './api/admin/SoundsRouter';
import { soundCommandsRouter } from './api/admin/SoundCommandsRouter';
import { registerCommandsRouter } from './api/admin/RegisterCommandsRouter';

export const apiAdminRouter = express.Router();

apiAdminRouter.use((req: Request, res: Response, next: NextFunction) => {
  if (req.headers['authorization'] !== process.env.WEB_API_KEY) {
    res.status(403).header('content-type', 'text/plain').send('This maze was not meant for you.');
    return;
  }
  next();
});

apiAdminRouter.use('/register-commands', registerCommandsRouter);
apiAdminRouter.use('/sounds', soundsRouter);
apiAdminRouter.use('/sound-commands', soundCommandsRouter);
