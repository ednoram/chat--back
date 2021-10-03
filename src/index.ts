import express, { json, urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

import { PORT } from "@config";
// import { connectDB } from "@utils";

// connectDB();

const app = express();
const httpServer = createServer(app);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

const io = new Server(httpServer, { cors: { origin: true } });

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

httpServer.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
