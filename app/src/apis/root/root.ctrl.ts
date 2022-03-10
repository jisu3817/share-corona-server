import { Request, Response } from 'express';
import User from '../../models/services/User/User';

const process: any = {
  signUp: (req: Request, res: Response) => {
    const user = new User(req);
    const response = user.signUp();
  },
};

export default { process };
