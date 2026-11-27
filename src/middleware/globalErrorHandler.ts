import type { NextFunction, Request, Response } from "express";
import app from "../app";

export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "ValidationError") {
      statusCode = 400;
      message = "Invalid data provided";
    }

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  });
}
