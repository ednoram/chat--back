import { Request, Response } from "express";

import { Room } from "@models";
import { getErrorMessage } from "@utils";

const getRooms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getRooms;