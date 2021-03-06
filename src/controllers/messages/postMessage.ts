import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { Room, Message } from "@models";
import { getErrorMessage } from "@utils";

const postMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, roomId } = req.body;
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

    const newMessage = new Message({
      text,
      roomId,
      username: user.username,
    });

    const savedMessage = await newMessage.save();

    res.status(200).json(savedMessage);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default postMessage;
