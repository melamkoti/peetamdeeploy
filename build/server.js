"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const activity_1 = __importDefault(require("./activity"));
const product_1 = __importDefault(require("./product"));
const eventsRoutes_1 = __importDefault(require("./eventsRoutes"));
const post_1 = __importDefault(require("./post"));
const contactUs_1 = __importDefault(require("./contactUs"));
const cart_1 = __importDefault(require("./cart"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const corsOptions = {
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use("/activities", activity_1.default);
app.use("/product", product_1.default);
app.use("/event", eventsRoutes_1.default);
app.use("/post", post_1.default);
app.use("/contact", contactUs_1.default);
app.use("/cart", cart_1.default);
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
