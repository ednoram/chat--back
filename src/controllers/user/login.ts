import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "@models";
import { signJWT, getErrorMessage } from "@utils";

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ errors: ["User not found"] });
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      res.status(403).json({ errors: ["Password is incorrect"] });
      return;
    }

    const token = signJWT(user._id, user.username);

    res.status(200).json({ token, user });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default login;
