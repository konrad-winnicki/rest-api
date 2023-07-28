import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const tokenSignature = process.env.TOKEN_SIGNATURE || "token_testing_signature";

export const userAuthorizer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string = "";
  const authorization = req.get("authorization");
  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }
  if (!token) {
    return res.status(401).json("No token or invalid token");
  }
  const decodedToken = verifyAndDecodeToken(token);
  if (!token || !decodedToken) {
    return res.status(401).json("No token, invalid or expired token");
  }
  req.body.userId = decodedToken.id;
  next();
};

function verifyAndDecodeToken(token: string): JwtPayload | null {
  let decodedToken = null;
  try {
    decodedToken = jwt.verify(token, tokenSignature, {
      ignoreExpiration: false,
    }) as JwtPayload;
  } catch (error: unknown) {
    if (error === "jwt expired") {
      return null;
    }
    throw error;
  }
  return decodedToken;
}
