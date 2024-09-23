import express from "express";
const {
  upcomingEvents,
  oldEvents,
  Events,
  DeleteEvent,
  UpdateEvent,
} = require("./controllers/EventController");

const router = express.Router();

router.get("/upcoming-events", upcomingEvents);

router.get("/old-events", oldEvents);

router.get("/", Events);
router.delete("/:id", DeleteEvent);

router.put("/:id", UpdateEvent);
export default router;
