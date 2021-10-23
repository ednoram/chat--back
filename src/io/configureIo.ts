import { Server } from "node_modules/socket.io/dist";

import addRoomSocket from "./addRoomSocket";
import addMessageSocket from "./addMessageSocket";

const configureIo = (io: Server): void => {
  io.on("connection", (socket) => {
    addRoomSocket(socket);
    addMessageSocket(io, socket);
  });
};

export default configureIo;
