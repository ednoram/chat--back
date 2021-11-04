import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";

import { Room, Message } from "@models";
import { getErrorMessage } from "@utils";

const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomPassword } = req.body;
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      res.status(401).json({ errors: ["Not authorized"] });
      return;
    }

    if (!isValidObjectId(id)) {
      res.status(400).json({ errors: ["Invalid message ID"] });
      return;
    }

    const message = await Message.findOne({ _id: id });

    if (!message) {
      res.status(400).json({ errors: ["Message not Found"] });
      return;
    }

    if (message.username !== user.username) {
      res.status(403).json({ errors: ["Message does not belong to you"] });
      return;
    }

    const room = await Room.findOne({ _id: message.roomId });

    if (!room) {
      await Message.deleteMany({ roomId: message.roomId });

      res.status(404).json({ errors: ["Room not found"] });
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(roomPassword, room.password);

    if (!passwordIsCorrect) {
      res.status(403).json({ errors: ["Room password is incorrect"] });
      return;
    }

    await Message.findOneAndDelete({ _id: id });

    res.status(200).json({ success: true });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default deleteMessage;
