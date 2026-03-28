import { Router } from "express";
import { listUsersController } from "../controllers/user.controller.js";

const userRoutes: Router = Router();

userRoutes.get("/", listUsersController);

export default userRoutes;
