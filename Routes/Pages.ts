import { Router, Request, Response } from "express";

export const pagesRouter = Router();

const COOKIE_NAME = "playerGUID";

const requirePlayer = (req: Request, res: Response): boolean => {
    const guid = req.cookies[COOKIE_NAME] as string | undefined;
    if (!guid) {
        res.redirect("/register");
        return false;
    }
    return true;
};

// Register page — always accessible
pagesRouter.get("/register", (_req: Request, res: Response) => {
    res.render("Register");
});

// Game page — requires player cookie
pagesRouter.get("/game", (req: Request, res: Response) => {
    if (!requirePlayer(req, res)) return;
    res.render("Game");
});

// Manage page — requires player cookie
pagesRouter.get("/manage", (req: Request, res: Response) => {
    if (!requirePlayer(req, res)) return;
    res.render("Manage");
});

// Root — redirect based on cookie
pagesRouter.get("/", (req: Request, res: Response) => {
    const guid = req.cookies[COOKIE_NAME] as string | undefined;
    res.redirect(guid ? "/game" : "/register");
});
