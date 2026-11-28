import type { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { sendErrorResponse, sendResponse } from "../../utils/sendResponse";

async function addBooking(req: Request, res: Response) {
  try {
    const result = await bookingServices.addBookingToDb(req.user!.id, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tickets booked successfully",
      data: result.rows[0],
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
}

export const bookingControllers = { addBooking };
