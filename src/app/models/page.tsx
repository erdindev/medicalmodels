import { prisma } from "@/lib/prisma";
import { ModelsClient } from "./models-client";

export const dynamic = "force-dynamic";

async function getSpecialties() {
  const specialties = await prisma.specialty.findMany({
    orderBy: { name: 'asc' }
  });
  return specialties.map(s => s.name);
}

async function getJournals() {
  const journals = await prisma.medicalModel.findMany({
    where: { journal: { not: null } },
    select: { journal: true },
    distinct: ['journal'],
    orderBy: { journal: 'asc' }
  });
  return journals.map(j => j.journal).filter(Boolean) as string[];
}

async function getTotalCount() {
  return prisma.medicalModel.count();
}

export default async function ModelsPage() {
  const [specialties, journals, totalCount] = await Promise.all([
    getSpecialties(),
    getJournals(),
    getTotalCount()
  ]);

  return <ModelsClient specialties={specialties} journals={journals} totalCount={totalCount} />;
}
