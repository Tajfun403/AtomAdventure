import { Sequelize } from "sequelize";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "database.sqlite");

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: DB_PATH,
    logging: false,
});
