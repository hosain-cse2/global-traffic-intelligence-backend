import { prisma } from "../db/prisma.js";
import type { PublicUser } from "./user.service.js";

export async function getMe(userId: string): Promise<PublicUser> {
  const user = (await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
    },
  })) as PublicUser;

  return user;
}
