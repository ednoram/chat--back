import { Request, Response } from "express";

import { Message, Room } from "@models";
import { getErrorMessage } from "@utils";

const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      res.status(403).json({ errors: ["Not authorized"] });
      return;
    }

    const room = await Room.findOne({ _id: id });

    if (!room) {
      res.status(404).json({ errors: ["Room not found"] });
      return;
    }

    if (String(user._id) !== room.adminId) {
      res.status(403).json({ errors: ["You are not the admin of this room"] });
      return;
    }

    await Message.deleteMany({ roomId: id });

    await Room.findOneAndDelete({ _id: id });

    res.status(200).json({ success: true });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default deleteRoom;
