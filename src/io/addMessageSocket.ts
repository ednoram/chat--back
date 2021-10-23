import { Server } from "node_modules/socket.io/dist";
import { Socket } from "node_modules/socket.io/dist";

import { IMessage } from "@types";

const addMessageSocket = (io: Server, socket: Socket): void => {
  socket.on("message", (message: IMessage) => {
    const roomId = message?.roomId;
    const processedMessage: IMessage = {
      ...message,
      text: message?.text?.trim(),
    };

    if (roomId && processedMessage.text && processedMessage.username) {
      io.to(roomId).emit("message", processedMessage);
    }
  });
};

export default addMessageSocket;
