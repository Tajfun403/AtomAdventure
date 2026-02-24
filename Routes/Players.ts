import { Router, Request, Response } from "express";
import { Player } from "../Models/Player";

export const playersRouter = Router();

// GET /players/:guid — get a single player by GUID
playersRouter.get("/:guid", async (req: Request, res: Response) => {
    try {
        const player = await Player.findByPk(req.params["guid"] as string);
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }
        return res.json(player);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// POST /player — create a new player
playersRouter.post("/", async (req: Request, res: Response) => {
    try {
        const player = await Player.create({});
        return res.status(201).json(player);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// PATCH /player — update player props (e.g. Prestige)
playersRouter.patch("/", async (req: Request, res: Response) => {
    try {
        const { GUID, Prestige } = req.body as { GUID?: string; Prestige?: number };

        if (!GUID) {
            return res.status(400).json({ error: "GUID is required" });
        }

        const player = await Player.findByPk(GUID);
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }

        if (Prestige !== undefined) {
            if (typeof Prestige !== "number") {
                return res.status(400).json({ error: "Prestige must be a number" });
            }
            player.Prestige = Prestige;
        }

        await player.save();
        return res.json(player);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
