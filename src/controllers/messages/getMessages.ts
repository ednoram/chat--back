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

    const messages: IMessage[] = await Message.find({ roomId });

    const sortedMessages = messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const returnedMessages = sortedMessages.slice(
      Math.max(0, sortedMessages.length - (Number(offset) + Number(limit))),
      Math.min(sortedMessages.length, sortedMessages.length - Number(offset))
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
