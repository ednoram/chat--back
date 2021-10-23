import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { Room, Message } from "@models";
import { getErrorMessage } from "@utils";

const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, roomPassword } = req.query;

    const room = await Room.findOne({ _id: roomId });

    if (!room || !roomPassword) {
      res.status(404).json({ errors: ["Room not found"] });
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(
      String(roomPassword),
      room.password
    );

    if (!passwordIsCorrect) {
      res.status(403).json({ errors: ["Password is incorrect"] });
      return;
    }

    const messages = await Message.find({ roomId });

    res.status(200).json(messages);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getMessages;
