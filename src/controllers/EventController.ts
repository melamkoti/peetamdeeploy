import express, { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const upcomingEvents = async (req: Request, res: Response) => {
  const currentDate = new Date();
  try {
    const events = await prisma.event.findMany({
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
  } catch (error) {
    res.json({ error: "Internal server error" });
  }
};

const oldEvents = async (req: Request, res: Response) => {
  const currentDate = new Date();
  try {
    const events = await prisma.event.findMany({
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
  } catch (error) {
    res.json({ error: "Internal server error" });
  }
};

const Events = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
};

const DeleteEvent = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
    res.status(200).send({ message: "event deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error Deleting Event" });
  }
};

const UpdateEvent = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id);
  const { title, description, image, date } = req.body;

  try {
    const updateEvent = await prisma.event.update({
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
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error Updating Event" });
  }
};

module.exports = {
  upcomingEvents,
  oldEvents,
  Events,
  DeleteEvent,
  UpdateEvent,
};
