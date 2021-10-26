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

    const rooms: IRoom[] = await Room.find();

    const filteredRooms =
      searchFilter && typeof searchFilter === "string"
        ? rooms.filter((room) =>
            room.name.toLowerCase().includes(searchFilter.trim().toLowerCase())
          )
        : rooms;

    const processedRooms = filteredRooms.map((room) => ({
      _id: room._id,
      name: room.name,
      adminId: room.adminId,
    }));

    const sortedRooms = processedRooms.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const returnedRooms = sortedRooms.slice(
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
