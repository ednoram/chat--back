import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { Room } from "@models";
import { getErrorMessage } from "@utils";

const getRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ errors: ["Invalid room ID"] });
      return;
    }

    const room = await Room.findOne({ _id: id });

    if (!room) {
      res.status(404).json({ errors: ["Room not found"] });
      return;
    }

    res.status(200).json(room);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getRoom;
