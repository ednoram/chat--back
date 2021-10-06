import jwt from "jsonwebtoken";

import { TOKEN_EXPIRY_SECONDS, TOKEN_SECRET } from "@config";

const signJWT = (_id: string, username: string): string => {
  return jwt.sign(
    {
      _id,
      username,
      duration: TOKEN_EXPIRY_SECONDS,
    },
    TOKEN_SECRET
  );
};

export default signJWT;
