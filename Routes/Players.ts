import { Router, Request, Response } from "express";
import { Player } from "../Models/Player.js";

export const playersRouter = Router();

const COOKIE_NAME = "playerGUID";

// GET /players -- get the current player (GUID from cookie)
playersRouter.get("/", async (req: Request, res: Response) => {
    try {
        const guid = req.cookies[COOKIE_NAME] as string | undefined;
        if (!guid) {
            return res.status(401).json({ error: "No player cookie set." });
        }

        const player = await Player.findByPk(guid);
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }
        return res.json(player);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// POST /players -- create a new player and store their GUID in a cookie
playersRouter.post("/", async (req: Request, res: Response) => {
    try {
        const player = await Player.create({});
        res.cookie(COOKIE_NAME, player.GUID, { httpOnly: true, sameSite: "lax", maxAge: 2**40 });
        return res.status(201).json(player);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// PATCH /players -- update current player's props (GUID from cookie)
playersRouter.patch("/", async (req: Request, res: Response) => {
    try {
        const guid = req.cookies[COOKIE_NAME] as string | undefined;
        if (!guid) {
            return res.status(401).json({ error: "No player cookie set." });
        }

        const { Prestige } = req.body as { Prestige?: number };

        const player = await Player.findByPk(guid);
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
