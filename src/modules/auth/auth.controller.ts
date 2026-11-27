import type { Request, Response } from "express";
import { authServices } from "./auth.service";
import { sendErrorResponse, sendResponse } from "../../utils/sendResponse";

async function registerUser(req: Request, res: Response) {
  try {
    const result = await authServices.registerUserIntoDb(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
}

async function loginUser(req: Request, res: Response) {
  try {
    const result = await authServices.loginUserIntoDb(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
}

export const authControllers = { registerUser, loginUser };
