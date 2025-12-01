import nextDynamic from "next/dynamic";
import { HeroSearch } from "@/components/home/hero-search";
import { prisma } from "@/lib/prisma";

// Lazy load animated sections to reduce initial bundle
const SpecialtySection = nextDynamic(() => import("@/components/home/animated-sections").then(mod => ({ default: mod.SpecialtySection })), {
  loading: () => <div className="pt-8 pb-6" />,
});
const FeaturesSection = nextDynamic(() => import("@/components/home/animated-sections").then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <div className="py-8" />,
});

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

  // JSON-LD for Organization and WebSite
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://medicalmodels.co/#website",
        "url": "https://medicalmodels.co",
        "name": "MedicalModels",
        "description": "Comprehensive database of peer-reviewed medical AI models",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://medicalmodels.co/models?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://medicalmodels.co/#organization",
        "name": "MedicalModels",
        "url": "https://medicalmodels.co",
        "description": `Database of ${stats.modelCount}+ medical AI models from peer-reviewed publications`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSearch modelCount={stats.modelCount} specialtyCount={stats.specialtyCount} />
      <SpecialtySection specialties={topSpecialties} />
      <FeaturesSection modelCount={stats.modelCount} />
    </div>
  );
}
