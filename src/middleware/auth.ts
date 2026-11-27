import type { NextFunction, Response, Request } from "express";
import type { Role } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import { pool } from "../config/db";
import { sendResponse } from "../utils/sendResponse";

export default function auth(...roles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token =
        authHeader?.slice(0, 7).toLowerCase() === "bearer "
          ? authHeader.slice(7).trim()
          : authHeader;

      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Missing/Invalid token!!",
        });
      }

      const decode = jwt.verify(
        token as string,
        config.jwtSecret,
      ) as JwtPayload;

      const user = await pool.query(
        `
        SELECT * FROM users WHERE id=$1
      `,
        [decode.id],
      );

      if (user.rowCount === 0) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "User not found!",
        });
      }

      if (roles.length && !roles.includes(user.rows[0].role)) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Unauthorized access",
        });
      }

      req.user = decode;
      next();
    } catch (error) {
      next(error);
    }
  };
}
