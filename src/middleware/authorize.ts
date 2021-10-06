import { Request, Response, NextFunction } from "express";

import { User } from "@models";
import { verifyJWT } from "@utils";

const authorize = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorizationHeader = req.headers.Authorization;
    const token = authorizationHeader && String(authorizationHeader);

    if (!token) {
      req.user = null;
      next();
      return;
    }

    const { username } = await verifyJWT(token);
    const user = await User.findOne({ username });

    req.user = user;
    next();
  } catch {
    req.user = null;
    next();
  }
};

export default authorize;
