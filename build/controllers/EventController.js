"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const upcomingEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    try {
        const events = yield prisma.event.findMany({
            where: {
                eventDate: {
                    gte: currentDate,
                },
            },
            orderBy: {
                eventDate: "asc",
            },
        });
        res.json(events);
    }
    catch (error) {
        res.json({ error: "Internal server error" });
    }
});
const oldEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    try {
        const events = yield prisma.event.findMany({
            where: {
                eventDate: {
                    lt: currentDate,
                },
            },
            orderBy: {
                eventDate: "desc",
            },
        });
        res.json(events);
    }
    catch (error) {
        res.json({ error: "Internal server error" });
    }
});
const Events = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany();
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching events" });
    }
});
const DeleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = parseInt(req.params.id);
    try {
        yield prisma.event.delete({
            where: {
                id: eventId,
            },
        });
        res.status(200).send({ message: "event deleted successfully" });
    }
    catch (error) {
        res.status(500).send({ error: "Error Deleting Event" });
    }
});
const UpdateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = parseInt(req.params.id);
    const { title, description, image, date } = req.body;
    try {
        const updateEvent = yield prisma.event.update({
            where: { id: eventId },
            data: {
                title,
                description,
                eventDate: new Date(date),
                image,
            },
        });
        res
            .status(200)
            .send({ message: "Event Updated Successfully!", updateEvent });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error Updating Event" });
    }
});
module.exports = {
    upcomingEvents,
    oldEvents,
    Events,
    DeleteEvent,
    UpdateEvent,
};
