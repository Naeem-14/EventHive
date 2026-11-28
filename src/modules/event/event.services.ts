import { error } from "node:console";
import { pool } from "../../config/db";
import AppError from "../../utils/AppError";
import type IEvent from "./event.interface";

async function addEventToDb(payload: IEvent, organizerId: string) {
  const { title, description, category, date, location, total_seats, price } =
    payload;

  const result = await pool.query(
    `
    INSERT INTO events (title, description, category, date, location, total_seats, available_seats, price, organizer_id)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `,
    [
      title,
      description,
      category,
      date,
      location,
      total_seats,
      total_seats,
      price,
      organizerId,
    ],
  );

  return result;
}

async function seeEventsFromDb(searchQuery: string) {
  const result = await pool.query(`
    SELECT * FROM events
  `);

  let filteredData = result.rows;

  const search = searchQuery.trim().toLowerCase();
  if (search) {
    filteredData = filteredData.filter(
      (event) =>
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search),
    );
  }

  return filteredData;
}

async function getSingleEventFromDb(id: string) {
  const event = await pool.query(
    `
    SELECT * FROM events WHERE id=$1
  `,
    [id],
  );

  if (event.rowCount === 0) {
    throw new AppError("Event not found!", 404);
  }

  const organizer = await pool.query(
    `
    SELECT id, name, email FROM users WHERE id=$1
  `,
    [event.rows[0].organizer_id],
  );

  const { created_at, updated_at, ...eventDetails } = event.rows[0];

  const result = {
    ...eventDetails,
    organizer: { ...organizer.rows[0] },
    created_at,
    updated_at,
  };
  return result;
}

async function updateEventFromDb(
  id: string,
  updaterId: string,
  payload: Partial<IEvent>,
) {
  const { title, description, category, date, location, total_seats, price } =
    payload;

  const organizerId = await pool.query(
    `
      SELECT organizer_id FROM events WHERE id=$1
    `,
    [id],
  );
  if (Object.keys(payload).length === 0) {
    throw new AppError("Empty Body", 400);
  } else if (organizerId.rowCount === 0) {
    throw new AppError("Event not found", 404);
  } else if (organizerId.rows[0].organizer_id !== updaterId) {
    throw new AppError("You are not the owner of this event!", 403);
  }

  const result = await pool.query(
    `
    UPDATE events
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      category = COALESCE($3, category),
      date = COALESCE($4, date),
      location = COALESCE($5, location),
      total_seats = COALESCE($6, total_seats),
      available_seats = total_seats,
      price = COALESCE($7, price),
      updated_at = NOW()


      WHERE id = $8
      RETURNING *
  `,
    [
      title ?? null,
      description ?? null,
      category ?? null,
      date ?? null,
      location ?? null,
      total_seats ?? null,
      price ?? null,
      id,
    ],
  );

  return result;
}

export const eventServices = {
  addEventToDb,
  seeEventsFromDb,
  getSingleEventFromDb,
  updateEventFromDb,
};
