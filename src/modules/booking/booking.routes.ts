import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../types";

const router = Router();

router.post(
  "/",
  auth(USER_ROLES.attendee, USER_ROLES.organizer),
  bookingControllers.addBooking,
);
router.get(
  "/",
  auth(USER_ROLES.attendee, USER_ROLES.organizer),
  bookingControllers.getBookings,
);
router.patch(
  "/:id/cancel",
  auth(USER_ROLES.attendee, USER_ROLES.organizer),
  bookingControllers.cancelBooking,
);

export const bookingRoutes = router;
