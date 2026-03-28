import { Router, type Request, type Response } from "express";

const healthRoutes: Router = Router();

healthRoutes.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
});

export default healthRoutes;
