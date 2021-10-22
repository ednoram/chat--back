import { Request, Response } from "express";

import { Room } from "@models";
import { getErrorMessage } from "@utils";

const postRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const user = req.user;

    const processedName = name.trim().replace(/ +(?= )/g, "");

    if (!user) {
      res.status(403).json({ errors: ["Not authorized"] });
      return;
    }

    const foundRoom = await Room.findOne({ name: processedName });

    if (foundRoom) {
      res
        .status(409)
        .json({ errors: ["A room with this name already exists"] });
      return;
    }

    const newRoom = new Room({
      adminId: user._id,
      name: processedName,
    });

    const savedRoom = await newRoom.save();

    res.status(200).json(savedRoom);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default postRoom;
