import { Router } from "express";
import { body, query } from "express-validator";

import {
  getMessages,
  postMessage,
  deleteMessage,
  deleteRoomMessages,
} from "@controllers";
import { validate } from "@middleware";

const router = Router();

router.get(
  "/",
  query("roomId").exists().withMessage("Room ID query is required"),
  query("limit")
    .isNumeric()
    .withMessage("Limit is required and must be numeric"),
  query("offset")
    .isNumeric()
    .withMessage("Offset is required and must be numeric"),
  validate,
  getMessages
);

router.post(
  "/",
  body("text")
    .isLength({ min: 1, max: 800 })
    .withMessage("Message must be 1-800 characters long"),
  body("roomId").exists().withMessage("Room ID is required"),
  validate,
  postMessage
);

router.delete(
  "/",
  body("roomId").exists().withMessage("Room ID is required"),
  body("roomPassword").exists().withMessage("Room password is required"),
  validate,
  deleteRoomMessages
);

router.delete(
  "/:id",
  body("roomPassword").exists().withMessage("Room password is required"),
  validate,
  deleteMessage
);

export default router;
