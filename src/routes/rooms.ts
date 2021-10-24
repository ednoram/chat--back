import { Router } from "express";
import { body } from "express-validator";

import {
  getRoom,
  getRooms,
  postRoom,
  deleteRoom,
  updateRoom,
} from "@controllers";
import { validate } from "@middleware";

const router = Router();

router.get("/", getRooms);
router.get("/:id", getRoom);

router.post(
  "/",
  body("name")
    .isLength({ min: 4, max: 16 })
    .withMessage("Room name must be 4-16 characters long"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters long"),
  validate,
  postRoom
);

router.patch(
  "/:id",
  body("currentPassword").exists().withMessage("Current Password is required"),
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("New password must be 8-16 characters long"),
  validate,
  updateRoom
);

router.delete("/:id", deleteRoom);

export default router;
