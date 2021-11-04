import { Server } from "node_modules/socket.io/dist";
import { Socket } from "node_modules/socket.io/dist";

import { IMessage } from "@types";

const addDeleteMessageSocket = (io: Server, socket: Socket): void => {
  socket.on("delete-message", (message: IMessage) => {
    const roomId = message?.roomId;

    if (roomId && message && message._id) {
      io.to(roomId).emit("delete-message", message);
    }
  });
};

export default addDeleteMessageSocket;
