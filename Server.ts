import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));

import { sequelize } from "./Models/index";
import "./Models/Player";
import "./Models/Item";
sequelize.sync({ force: false });

import { inventoryRouter } from "./Routes/Inventory";
import { itemsRouter } from "./Routes/Items";
import { playersRouter } from "./Routes/Players";
import { pagesRouter } from "./Routes/Pages";

app.use("/inventory", inventoryRouter);
app.use("/items", itemsRouter);
app.use("/players", playersRouter);
app.use("/", pagesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));