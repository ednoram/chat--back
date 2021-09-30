import express, { json, urlencoded } from "express";
import cors from "cors";
import "dotenv/config";

import { PORT } from "@config";
import { connectDB } from "@utils";

connectDB();

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
