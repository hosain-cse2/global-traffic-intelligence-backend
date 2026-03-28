import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { listUsers, type PublicUser } from "../services/user.service.js";

export async function listUsersController(
  _req: AuthenticatedRequest,
  res: Response<{ users: PublicUser[] } | { error: string }>,
): Promise<void> {
  try {
    const users = await listUsers();
    res.status(200).json({ users });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}
