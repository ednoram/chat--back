import { Schema, model } from "mongoose";

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "rooms",
  }
);

export default model("Room", RoomSchema);
