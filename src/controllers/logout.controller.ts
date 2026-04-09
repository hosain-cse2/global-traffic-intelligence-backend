import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import type { Response } from "express";

export async function logoutController(
  req: AuthenticatedRequest,
  res: Response<{ message: string } | { error: string }>,
): Promise<void> {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}
