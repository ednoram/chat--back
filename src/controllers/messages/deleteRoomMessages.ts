import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";

import { Room, Message } from "@models";
import { getErrorMessage } from "@utils";

const deleteRoomMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roomId, roomPassword } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ errors: ["Not authorized"] });
      return;
    }

    if (!isValidObjectId(roomId)) {
      res.status(400).json({ errors: ["Invalid room ID"] });
      return;
    }

    const room = await Room.findOne({ _id: roomId });

    if (!room) {
      res.status(404).json({ errors: ["Room not found"] });
      return;
    }

    if (String(user._id) !== room.adminId) {
      res.status(403).json({ errors: ["You are not the admin of this room"] });
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(roomPassword, room.password);

    if (!passwordIsCorrect) {
      res.status(403).json({ errors: ["Password is incorrect"] });
      return;
    }

    await Message.deleteMany({ roomId });

    res.status(200).json({ success: true });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default deleteRoomMessages;
