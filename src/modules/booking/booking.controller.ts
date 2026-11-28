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

async function getBookings(req: Request, res: Response) {
  try {
    const result = await bookingServices.getBookingsFromDb(req.user!.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
}

async function cancelBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await bookingServices.cancelBookingFromDb(
      id as string,
      req.user!.id,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking cancelled successfully",
      data: result.rows[0],
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
}

export const bookingControllers = { addBooking, getBookings, cancelBooking };
