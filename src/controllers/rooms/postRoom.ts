import { Request, Response } from "express";

import { Room } from "@models";
import { getErrorMessage, hashPassword } from "@utils";

const postRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password } = req.body;
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

    if (password.includes(" ")) {
      res.status(422).json({ errors: ["Password can not contain spaces"] });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newRoom = new Room({
      adminId: user._id,
      name: processedName,
      password: hashedPassword,
    });

    const savedRoom = await newRoom.save();

    res.status(200).json(savedRoom);
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default postRoom;
