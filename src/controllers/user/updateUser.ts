import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "@models";
import { hashPassword, getErrorMessage } from "@utils";

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ errors: ["Not authorized"] });
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordIsCorrect) {
      res.status(403).json({ errors: ["Password is incorrect"] });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default updateUser;
