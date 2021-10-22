import { Request, Response } from "express";

import { Room } from "@models";
import { IRoom } from "@types";
import { getErrorMessage } from "@utils";

const getRooms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rooms: IRoom[] = await Room.find();
    const sortedRooms = rooms.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(sortedRooms);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getRooms;
