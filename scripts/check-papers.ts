import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Count by specialty
  const stats = await prisma.scrapedPaper.groupBy({
    by: ["specialty"],
    _count: true,
  });
  console.log("\n=== Papers by Specialty ===");
  console.table(stats);

  // Papers with code
  const withCode = await prisma.scrapedPaper.findMany({
    where: { hasModel: true },
    select: { title: true, githubUrl: true, codeLinks: true, specialty: true },
  });
  console.log("\n=== Papers with Code Links ===");
  for (const p of withCode) {
    console.log(`- ${p.title.substring(0, 60)}...`);
    console.log(`  GitHub: ${p.githubUrl || "N/A"}`);
    console.log(`  Links: ${p.codeLinks}`);
  }

  // Sample papers
  const samples = await prisma.scrapedPaper.findMany({
    take: 5,
    orderBy: { pubDate: "desc" },
    select: { title: true, journal: true, pubDate: true, specialty: true, pubmedUrl: true },
  });
  console.log("\n=== Recent Papers (Sample) ===");
  console.table(samples.map(s => ({
    title: s.title.substring(0, 50) + "...",
    journal: s.journal?.substring(0, 20),
    date: s.pubDate,
    specialty: s.specialty,
  })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
