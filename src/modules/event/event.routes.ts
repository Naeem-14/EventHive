import { Router } from "express";
import { eventControllers } from "./event.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../types";
const router = Router();

router.post("/", auth(USER_ROLES.organizer), eventControllers.addEvent);
router.get("/", eventControllers.seeEvents);

export const eventRoutes = router;
