import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";
import type { PublicUser } from "../services/user.service.js";
import { getMe } from "../services/session.service.js";

export async function getMeController(
  req: AuthenticatedRequest,
  res: Response<PublicUser | { error: string }>,
): Promise<void> {
  const currentUser = await getMe(req.user?.userId as string);
  if (!currentUser) {
    res.status(401).json({ error: "Session invalid" });
  } else {
    res.status(200).json(currentUser);
  }
}
