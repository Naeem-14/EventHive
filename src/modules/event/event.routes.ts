import { Router } from "express";
import { eventControllers } from "./event.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../types";
const router = Router();

router.post("/", auth(USER_ROLES.organizer), eventControllers.addEvent);
router.get("/", eventControllers.seeEvents);
router.get("/:id", eventControllers.getSingleEvent);
router.patch("/:id", auth(USER_ROLES.organizer), eventControllers.updateEvent);
router.delete("/:id", auth(USER_ROLES.organizer), eventControllers.deleteEvent);

export const eventRoutes = router;
