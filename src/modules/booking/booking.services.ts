import { pool } from "../../config/db";
import AppError from "../../utils/AppError";
import type IBooking from "./booking.interface";

async function addBookingToDb(attendeeId: string, payload: IBooking) {
  const { event_id, tickets_booked } = payload;

  const event = await pool.query(
    `
    SELECT * FROM events WHERE id=$1
  `,
    [event_id],
  );

  const chosenEvent = event.rows[0];

  if (event.rowCount === 0) {
    throw new AppError("Event not found", 404);
  } else if (chosenEvent.organizer_id === attendeeId) {
    throw new AppError("Forbidden", 403);
  } else if (chosenEvent.date < new Date()) {
    throw new AppError("Event is already finished", 400);
  } else if (chosenEvent.available_seats <= tickets_booked) {
    throw new AppError("Insufficient seats", 400);
  }

  const ticketPrice = chosenEvent.price * tickets_booked;
  const result = await pool.query(
    `
    INSERT INTO bookings (event_id, tickets_booked, attendee_id, total_price)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
    [event_id, tickets_booked, attendeeId, ticketPrice],
  );

  const remainingSeats = chosenEvent.available_seats - tickets_booked;
  await pool.query(
    `
    UPDATE events
    SET available_seats = $1
    WHERE id=$2
  `,
    [remainingSeats, event.rows[0].id],
  );

  return result;
}

async function getBookingsFromDb(userId: string) {
  const result = await pool.query(
    `
    SELECT
      b.id,
      json_build_object(
        'id', e.id,
        'title', e.title,
        'date', e.date,
        'location', e.location
      ) AS event,
      b.tickets_booked,
      b.total_price,
      b.status,
      b.created_at
    FROM bookings AS b
    INNER JOIN events AS e
      ON b.event_id = e.id
    WHERE b.attendee_id = $1
    ORDER BY b.created_at DESC
  `,
    [userId],
  );

  return result;
}

async function cancelBookingFromDb(id: string, userId: string) {
  const booking = await pool.query(
    `
    SELECT * FROM bookings WHERE id=$1
  `,
    [id],
  );
  const bookedEvent = booking.rows[0];

  if (booking.rowCount === 0) {
    throw new AppError("Booking not found", 404);
  } else if (userId !== bookedEvent.attendee_id) {
    throw new AppError("", 403);
  } else if (bookedEvent.status === "cancelled") {
    throw new AppError("Booking already cancelled", 409);
  }

  const event = await pool.query(
    `
    SELECT * FROM events WHERE id=$1
  `,
    [bookedEvent.event_id],
  );

  if (event.rows[0].date < new Date()) {
    throw new AppError("The event has already passed", 400);
  }

  const result = await pool.query(
    `
    UPDATE bookings
    SET status = 'cancelled'
    WHERE id=$1
    RETURNING *
  `,
    [bookedEvent.id],
  );

  return result;
}

export const bookingServices = {
  addBookingToDb,
  getBookingsFromDb,
  cancelBookingFromDb,
};
