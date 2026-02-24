import { Router, Request, Response } from "express";
import { Item } from "../Models/Item";

export const itemsRouter = Router();

// GET /items -- get all items
itemsRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const items = await Item.findAll();
        return res.json(items);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /items/random -- get a single random item
itemsRouter.get("/random", async (_req: Request, res: Response) => {
    try {
        const count = await Item.count();
        if (count === 0) {
            return res.status(404).json({ error: "No items exist" });
        }
        const offset = Math.floor(Math.random() * count);
        const item = await Item.findOne({ offset });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
