import { Router } from "express";
import { body } from "express-validator";

import {
  login,
  getUsers,
  register,
  updateUser,
  loginWithToken,
} from "@controllers";
import { validate } from "@middleware";

const router = Router();

router.get("/", getUsers);

router.post("/login-with-token", loginWithToken);

router.post(
  "/register",
  body("username")
    .isLength({ min: 6, max: 12 })
    .withMessage("Username must be 6-12 characters long"),
  body("username").isLowercase().withMessage("Username must be lowercase"),
  body("username")
    .custom((value) => !value || !value.trim().includes(" "))
    .withMessage("Username must not contain spaces"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters long"),
  body("password")
    .custom((value) => !value || !value.includes(" "))
    .withMessage("Password must not contain spaces"),
  body("passwordConfirmation")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  validate,
  register
);

router.post(
  "/login",
  body("username").exists().withMessage("Username is required"),
  body("password").exists().withMessage("Password is required"),
  validate,
  login
);

router.patch(
  "/",
  body("currentPassword").exists().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters long"),
  body("newPassword")
    .custom((value) => !value || !value.includes(" "))
    .withMessage("Password must not contain spaces"),
  body("passwordConfirmation")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
  validate,
  updateUser
);

export default router;
