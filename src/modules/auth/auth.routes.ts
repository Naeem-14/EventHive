import { Router } from "express";
import { authControllers } from "./auth.controller";
const router = Router();

router.post("/", authControllers.registerUser);

export const authRoutes = router;
