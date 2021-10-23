import bcrypt from "bcrypt";
import { Socket } from "node_modules/socket.io/dist";

import { Room } from "@models";

const addRoomSocket = (socket: Socket): void => {
  socket.on("room", async (roomId, roomPassword) => {
    const processedRoomId = roomId.trim();

    const room = await Room.findOne({ _id: processedRoomId });

    if (!room) return;

    const passwordIsCorrect = await bcrypt.compare(roomPassword, room.password);

    if (processedRoomId && passwordIsCorrect) {
      const socketRooms = Array.from(socket.rooms);

      socketRooms.map((room) => {
        socket.leave(room);
      });

      socket.join(processedRoomId);
    }
  });
};

export default addRoomSocket;
