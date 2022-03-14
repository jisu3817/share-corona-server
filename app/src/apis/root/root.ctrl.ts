import { Request, Response } from 'express';
import User from '../../models/services/User/User';

interface iResponse {
  success?: boolean;
  msg?: string;
  isError?: boolean;
  errMsg?: string;
  clientMsg?: string;
}

const process = {
  signUp: async (req: Request, res: Response): Promise<Response> => {
    const user = new User(req);
    const response: iResponse = await user.signUp();

    if (response.success) return res.status(201).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },
};

export { process };
