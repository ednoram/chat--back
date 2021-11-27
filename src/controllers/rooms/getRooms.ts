import { Request, Response } from "express";

import { Room } from "@models";
import { IRoom } from "@types";
import { getErrorMessage } from "@utils";

const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { offset, limit, searchFilter } = req.query;

    if (
      typeof Number(limit) !== "number" ||
      typeof Number(offset) !== "number"
    ) {
      res.status(400).json({
        errors: ["Offset and limit are required and must be numeric"],
      });
      return;
    }

    const rooms: IRoom[] = await Room.find()
      .select({
        _id: 1,
        name: 1,
        adminId: 1,
      })
      .sort({ name: 1 });

    const nameFilter: string =
      typeof searchFilter === "string" ? searchFilter.trim().toLowerCase() : "";

    const filteredRooms: IRoom[] = rooms.filter((room) =>
      room.name.toLowerCase().includes(nameFilter)
    );

    const returnedRooms: IRoom[] = filteredRooms.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );

    res.status(200).json({
      rooms: returnedRooms,
      totalCount: filteredRooms.length,
    });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default getRooms;
