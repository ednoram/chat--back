import { Request, Response } from "express";

import { User } from "@models";
import { getErrorMessage } from "@utils";

const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select({ _id: 1, username: 1 });
    res.status(200).json(users);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getUsers;
