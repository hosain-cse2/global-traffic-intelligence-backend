import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "alice@example.com",
        passwordHash,
        firstName: "Alice",
        lastName: "Anderson",
      },
      {
        email: "bob@example.com",
        passwordHash,
        firstName: "Bob",
        lastName: "Brown",
      },
    ],
  });

  console.log("Seeded users successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
