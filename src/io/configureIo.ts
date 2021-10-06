import { Server } from "node_modules/socket.io/dist";

const configureIo = (io: Server): void => {
  io.on("connection", (socket) => {
    socket.on("message", (message, room) => {
      const processedRoom = room && room.trim();
      const processedMessage = message && message.trim();

      if (processedRoom && processedMessage) {
        io.to(processedRoom).emit("message", processedMessage);
      }
    });

    socket.on("room", (room) => {
      const processedRoom = room && room.trim();

      if (processedRoom) {
        const socketRooms = Array.from(socket.rooms);

        socketRooms.map((room) => {
          socket.leave(room);
        });

        socket.join(processedRoom);
      }
    });
  });
};

export default configureIo;
