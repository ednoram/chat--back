import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);

export default model("Message", MessageSchema);
