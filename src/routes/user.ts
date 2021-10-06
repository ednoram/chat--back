import { Router } from "express";
import { body } from "express-validator";

import { validate } from "@middleware";
import { login, register, getUsers, loginWithToken } from "@controllers";

const router = Router();

router.get("/", getUsers);

router.post("/login-with-token", loginWithToken);

router.post(
  "/register",
  body("username")
    .isLength({ min: 6, max: 12 })
    .withMessage("Username must be 6-12 characters long"),
  body("username").isLowercase().withMessage("Username must be lowercase"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters long"),
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

export default router;
