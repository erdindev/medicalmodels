import { prisma } from "@/lib/prisma";
import { ModelsClient } from "./models-client";

export const dynamic = "force-dynamic";

async function getModels() {
  const models = await prisma.medicalModel.findMany({
    include: {
      metrics: true,
      specialty: true,
      useCase: true,
      validation: true,
      regulatory: true,
      practical: true,
      training: true,
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return models.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    version: m.version,
    description: m.description,
    architecture: m.architecture,
    journal: m.journal,
    specialty: m.specialty?.name || 'General',
    useCase: m.useCase?.name || 'General',
    tags: m.tags?.map((t) => t.tag.name) || [],
    metrics: {
      sensitivity: m.metrics?.sensitivity ?? 0,
      specificity: m.metrics?.specificity ?? 0,
      auc: m.metrics?.auc ?? 0,
      accuracy: m.metrics?.accuracy ?? 0
    },
    validation: {
      validationType: m.validation?.validationType || 'retrospective',
      externalValidation: m.validation?.externalValidation || false
    },
    regulatory: {
      fdaApproved: m.regulatory?.fdaApproved || false,
      ceMark: m.regulatory?.ceMark || false,
      gdprCompliant: m.regulatory?.gdprCompliant || false
    },
    practical: {
      accessType: m.practical?.accessType || 'research-only'
    }
  }));
}

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

export default async function ModelsPage() {
  const [models, specialties, journals] = await Promise.all([
    getModels(),
    getSpecialties(),
    getJournals()
  ]);

  return <ModelsClient initialModels={models} specialties={specialties} journals={journals} />;
}
