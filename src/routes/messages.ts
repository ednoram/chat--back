import { Router } from "express";
import { body, query } from "express-validator";

import { validate } from "@middleware";
import { getMessages, postMessage } from "@controllers";

const router = Router();

router.get(
  "/",
  query("roomId").exists().withMessage("Room ID query is required"),
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

export default router;
