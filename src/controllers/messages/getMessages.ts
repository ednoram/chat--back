import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { IMessage } from "@types";
import { Room, Message } from "@models";
import { getErrorMessage } from "@utils";

const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, roomPassword, offset, limit } = req.query;

    if (
      typeof Number(limit) !== "number" ||
      typeof Number(offset) !== "number"
    ) {
      res.status(400).json({
        errors: ["Offset and limit are required and must be numeric"],
      });
      return;
    }

    const room = await Room.findOne({ _id: roomId });

    if (!room) {
      res.status(404).json({ errors: ["Room not found"] });
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(
      String(roomPassword),
      room.password
    );

    if (!passwordIsCorrect) {
      res.status(403).json({ errors: ["Room password is incorrect"] });
      return;
    }

    const messages: IMessage[] = await Message.find({ roomId }).sort({
      createdAt: 1,
    });

    const returnedMessages = messages.slice(
      Math.max(0, messages.length - (Number(offset) + Number(limit))),
      Math.min(messages.length, messages.length - Number(offset))
    );

    res.status(200).json({
      messages: returnedMessages,
      totalCount: messages.length,
    });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getMessages;
