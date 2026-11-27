import type { Request, Response } from "express";
import { sendErrorResponse, sendResponse } from "../../utils/sendResponse";
import { eventServices } from "./event.services";

async function addEvent(req: Request, res: Response) {
  try {
    const result = await eventServices.addEventToDb(req.body, req.user!.id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Event created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
}

async function seeEvents(req: Request, res: Response) {
  try {
    const searchQuery =
      typeof req.query.search === "string" ? req.query.search : "";
    const result = await eventServices.seeEventsFromDb(searchQuery);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Events retrieved successfully",
      data: result.toReversed(),
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
}

export const eventControllers = {
  addEvent,
  seeEvents,
};
