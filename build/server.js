"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors = require("cors");
const body_parser_1 = __importDefault(require("body-parser"));
const Register = require("./register");
const Activity = require("./activity");
const Product = require("./Product");
const EventsRoutes = require("./eventsRoutes");
const Posts = require("./post");
const Contact = require("./contactUs");
const Cart = require("./cart");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const corsOptions = {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use("/imagdata", express_1.default.static("imagdata"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
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
