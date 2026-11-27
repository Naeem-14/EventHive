import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import type IAuth from "./auth.interface";
import AppError from "../../utils/AppError";

async function registerUserIntoDb(payload: IAuth) {
  const { name, email, password, role } = payload;

  const userExists = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
  `,
    [email],
  );
  if (userExists.rowCount !== 0) {
    throw new AppError("Email already exists!", 409);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, COALESCE($4, 'attendee'))
    RETURNING *
  `,
    [name, email, hashPassword, role],
  );

  delete result.rows[0].password;
  return result;
}

export const authServices = { registerUserIntoDb };
