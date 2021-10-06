import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { getErrorMessage } from "@utils";

const validate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      next();
      return;
    }

    const extractedErrors = errors.array().map((err) => err.msg);

    res.status(400).json({ errors: extractedErrors });
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(500).json({ errors: [message] });
  }
};

export default validate;
