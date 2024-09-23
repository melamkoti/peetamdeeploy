"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { upcomingEvents, oldEvents, Events, DeleteEvent, UpdateEvent, } = require("./controllers/EventController");
const router = express_1.default.Router();
router.get("/upcoming-events", upcomingEvents);
router.get("/old-events", oldEvents);
router.get("/", Events);
router.delete("/:id", DeleteEvent);
router.put("/:id", UpdateEvent);
exports.default = router;
