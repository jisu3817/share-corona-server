import { Request, Response } from 'express';
import User from '../../models/services/user/user';

const process = {
  signUp: async (req: Request, res: Response) => {
    const user = new User(req);

  },
};

export { process };