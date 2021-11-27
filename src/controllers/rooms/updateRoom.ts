import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";

import { Room } from "@models";
import { getErrorMessage, hashPassword } from "@utils";

const updateRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!isValidObjectId(id)) {
      res.status(400).json({ errors: ["Invalid room ID"] });
      return;
    }

    const room = await Room.findOne({ _id: id });

    if (!room) {
      res.status(404).json({ errors: ["Room not found"] });
      return;
    }

    if (!user) {
      res.status(401).json({ errors: ["Not authorized"] });
      return;
    }

    if (String(user._id) !== room.adminId) {
      res.status(403).json({ errors: ["You are not the admin of this room"] });
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(
      currentPassword,
      room.password
    );

    if (!passwordIsCorrect) {
      res.status(403).json({ errors: ["Password is incorrect"] });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await Room.findOneAndUpdate(
      { _id: id },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default updateRoom;
