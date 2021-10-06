import express, { json, urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

import { PORT } from "@config";
import { configureIo } from "@io";
import { connectDB } from "@utils";
import { userRoutes } from "@routes";
import { authorize } from "@middleware";

connectDB();

const app = express();
const httpServer = createServer(app);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use("/api", authorize);
app.use("/api/user", userRoutes);

const io = new Server(httpServer, { cors: { origin: true } });

configureIo(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
