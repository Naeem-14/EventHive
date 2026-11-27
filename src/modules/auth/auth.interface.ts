import type { Role } from "../../types";

export default interface IAuth {
  name: string;
  email: string;
  password: string;
  role?: Role;
}
