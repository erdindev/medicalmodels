import { HeroSearch } from "@/components/home/hero-search";
import { SpecialtySection, FeaturesSection } from "@/components/home/animated-sections";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  const [modelCount, specialtyCount] = await Promise.all([
    prisma.medicalModel.count(),
    prisma.specialty.count(),
  ]);
  return { modelCount, specialtyCount };
}

async function getTopSpecialties() {
  const specialties = await prisma.specialty.findMany({
    include: {
      _count: {
        select: { models: true }
      }
    },
    orderBy: {
      models: {
        _count: 'desc'
      }
    },
    take: 9
  });
  return specialties;
}

export default async function Home() {
  const [stats, topSpecialties] = await Promise.all([
    getStats(),
    getTopSpecialties()
  ]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSearch modelCount={stats.modelCount} specialtyCount={stats.specialtyCount} />
      <SpecialtySection specialties={topSpecialties} />
      <FeaturesSection modelCount={stats.modelCount} />
    </div>
  );
}
