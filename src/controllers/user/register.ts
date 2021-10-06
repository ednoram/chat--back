import { Request, Response } from "express";

import { User } from "@models";
import { hashPassword, getErrorMessage } from "@utils";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username });

    if (foundUser) {
      res
        .status(409)
        .json({ errors: ["User with this username already exists"] });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      password: hashedPassword,
      username: username.trim(),
    });

    await newUser.save();

    res.status(200).json({ success: true });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default register;
