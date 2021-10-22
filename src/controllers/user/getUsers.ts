import { Request, Response } from "express";

import { User } from "@models";
import { IUser } from "@types";
import { getErrorMessage } from "@utils";

const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    const returnedUsers = users.map(({ _id, username }: IUser) => ({
      _id,
      username,
    }));

    res.status(200).json(returnedUsers);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getUsers;
