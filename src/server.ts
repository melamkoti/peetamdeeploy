import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import bodyParser from "body-parser";

import Activity from "./activity";
import Product from "./product";
import EventsRoutes from "./eventsRoutes";
import Posts from "./post";
import Contact from "./contactUs";
import Cart from "./cart";

const app: Application = express();
const PORT = process.env.PORT || 3001;
const corsOptions = {
  origin: ["*"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/activities", Activity);
app.use("/product", Product);
app.use("/event", EventsRoutes);
app.use("/post", Posts);
app.use("/contact", Contact);
app.use("/cart", Cart);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
