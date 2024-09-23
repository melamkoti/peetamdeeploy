import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
const prisma = new PrismaClient();

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, category, message } =
    req.body;

  try {
    const newEntry = await prisma.contactForm.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        category,
        message,
      },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while saving the form" });
  }
});

export default router;
