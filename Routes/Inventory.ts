import { Router, Request, Response } from "express";
import { PlayerItem } from "../Models/PlayerItem";
import { Item } from "../Models/Item";
import { Player } from "../Models/Player";

export const inventoryRouter = Router();

const COOKIE_NAME = "playerGUID";

// GET /inventory -- get all inventory entries for the current player (GUID from cookie)
inventoryRouter.get("/", async (req: Request, res: Response) => {
    try {
        const playerGUID = req.cookies[COOKIE_NAME] as string | undefined;
        if (!playerGUID) {
            return res.status(401).json({ error: "No player cookie set." });
        }

        const player = await Player.findByPk(playerGUID);
        if (!player) {
            return res.status(404).json({ error: "Given player doesn't exist!" });
        }

        const entries = await PlayerItem.findAll({
            where: { PlayerGUID: playerGUID },
            include: [{ model: Item }],
        });

        return res.json(entries);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /inventory/:id -- delete an instanced inventory entry by its ID
inventoryRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params["id"] as string, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const entry = await PlayerItem.findByPk(id);
        if (!entry) {
            return res.status(404).json({ error: "Inventory entry doesn't exist!" });
        }

        await entry.destroy();
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// POST /inventory -- add an item to the current player's inventory (GUID from cookie)
inventoryRouter.post("/", async (req: Request, res: Response) => {
    try {
        const PlayerGUID = req.cookies[COOKIE_NAME] as string | undefined;
        if (!PlayerGUID) {
            return res.status(401).json({ error: "No player cookie set." });
        }

        const { ItemID } = req.body as { ItemID?: number };
        if (ItemID === undefined) {
            return res.status(400).json({ error: "ItemID is required." });
        }

        const player = await Player.findByPk(PlayerGUID);
        if (!player) {
            return res.status(404).json({ error: "Given player doesn't exist!" });
        }

        const item = await Item.findByPk(ItemID);
        if (!item) {
            return res.status(404).json({ error: "Given item doesn't exist!" });
        }

        const entry = await PlayerItem.create({ PlayerGUID, ItemID });
        return res.status(201).json(entry);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
