import { Request, Response } from "express";

import { signJWT, getErrorMessage } from "@utils";

const loginWithToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ errors: ["Not authorized"] });
      return;
    }

    const { _id, username } = user;

    const newToken = signJWT(_id, username);

    res.status(200).json({ user, token: newToken });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default loginWithToken;
