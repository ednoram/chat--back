import { Request, Response } from "express";

import { Room } from "@models";
import { getErrorMessage } from "@utils";

const getRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const room = await Room.findOne({ _id: id });
    res.status(200).json(room);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getRoom;
