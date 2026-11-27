import type { Response } from "express";

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

export function sendResponse<T>(res: Response, data: IResponse<T>) {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
}

export function sendErrorResponse(res: Response, error: any) {
  res.status(500).json({
    success: false,
    message: error?.message || "Internal Server Error",
    errors: error,
  });
}
