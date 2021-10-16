import { Router } from "express";
import { body } from "express-validator";

import { validate } from "@middleware";
import { getRoom, deleteRoom, getRooms, postRoom } from "@controllers";

const router = Router();

router.get("/", getRooms);
router.get("/:id", getRoom);

router.post(
  "/",
  body("name")
    .isLength({ min: 4, max: 16 })
    .withMessage("Room name must be 4-16 characters long"),
  validate,
  postRoom
);

router.delete("/:id", deleteRoom);

export default router;
