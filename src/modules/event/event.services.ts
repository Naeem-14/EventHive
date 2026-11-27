import { pool } from "../../config/db";
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

export const eventServices = { addEventToDb, seeEventsFromDb };
