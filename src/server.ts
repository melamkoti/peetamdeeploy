import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const cors = require("cors");

import bodyParser from "body-parser";
const Register = require("./register");

const Activity = require("./activity");
const Product = require("./Product");
const EventsRoutes = require("./eventsRoutes");
const Posts = require("./post");
const Contact = require("./contactUs");
const Cart = require("./cart");

const app: Application = express();
const PORT = process.env.PORT || 3001;
const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/imagdata", express.static("imagdata"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/user", Register);
app.use("/activities", Activity);
app.use("/product", Product);
app.use("/event", EventsRoutes);
app.use("/post", Posts);
app.use("/contact", Contact);
app.use("/cart", Cart);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
