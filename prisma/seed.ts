import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Mock Users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@medicalmodels.co" },
      update: {},
      create: {
        email: "admin@medicalmodels.co",
        name: "Admin User",
        role: "admin",
        plan: "team",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      },
    }),
    prisma.user.upsert({
      where: { email: "dr.sarah@hospital.com" },
      update: {},
      create: {
        email: "dr.sarah@hospital.com",
        name: "Dr. Sarah Chen",
        role: "pro",
        plan: "pro",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
    }),
    prisma.user.upsert({
      where: { email: "james.miller@research.edu" },
      update: {},
      create: {
        email: "james.miller@research.edu",
        name: "James Miller",
        role: "user",
        plan: "free",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      },
    }),
    prisma.user.upsert({
      where: { email: "dr.patel@clinic.org" },
      update: {},
      create: {
        email: "dr.patel@clinic.org",
        name: "Dr. Priya Patel",
        role: "pro",
        plan: "pro",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      },
    }),
    prisma.user.upsert({
      where: { email: "mike.johnson@uni.edu" },
      update: {},
      create: {
        email: "mike.johnson@uni.edu",
        name: "Mike Johnson",
        role: "user",
        plan: "free",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // List all users
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, plan: true },
  });
  console.log("\nAll users in database:");
  console.table(allUsers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
