import { Router, Request, Response } from "express";
import { Player } from "../Models/Player";

export const playersRouter = Router();

const COOKIE_NAME = "playerGUID";

// GET /players -- get the current player (GUID from cookie)
playersRouter.get("/", async (req: Request, res: Response) => {
    try {
        const guid = req.cookies[COOKIE_NAME] as string | undefined;
        console.log("Received request for player with GUID cookie: ", guid);
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
        const { Name } = req.body as { Name?: string };
        if (!Name || typeof Name !== "string" || Name.trim() === "") {
            return res.status(400).json({ error: "Name is required" });
        }

        const player = await Player.create({ Name: Name.trim() });
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

        const { Name, Prestige } = req.body as { Name?: string; Prestige?: number };

        const player = await Player.findByPk(guid);
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }

        if (Name !== undefined) {
            if (typeof Name !== "string" || Name.trim() === "") {
                return res.status(400).json({ error: "Name must be a non-empty string" });
            }
            player.Name = Name.trim();
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

playersRouter.patch("/prestige", async (req: Request, res: Response) => {
    try {
        const guid = req.cookies[COOKIE_NAME] as string | undefined;
        if (!guid) {
            return res.status(401).json({ error: "No player cookie set." });
        }

        const { amount } = req.body as { amount?: number };
        if (typeof amount !== "number") {
            return res.status(400).json({ error: "amount must be a number" });
        }

        const player = await Player.findByPk(guid);
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }

        player.Prestige += amount;
        await player.save();
        return res.json(player);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
