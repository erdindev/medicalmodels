import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateStaticParams() {
  const models = await prisma.medicalModel.findMany({
    select: { slug: true },
  });
  return models.map((model) => ({
    slug: model.slug,
  }));
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const model = await prisma.medicalModel.findUnique({
    where: { slug },
    include: {
      specialty: true,
      useCase: true,
      validation: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  if (!model) {
    notFound();
  }

  // Parse publication links
  let publicationLink = "#";
  try {
    if (model.validation?.publicationLinks) {
      const links = JSON.parse(model.validation.publicationLinks);
      if (Array.isArray(links) && links.length > 0) {
        publicationLink = links[0].url;
      }
    }
  } catch (e) {
    // Fallback if not JSON
    publicationLink = model.validation?.publicationLinks || "#";
  }

  return (
    <div className="min-h-screen bg-background bg-dot-grid">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/models" className="hover:text-foreground">Models</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{model.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">

          {/* Medical Field - above title */}
          <p className="text-sm font-light text-muted-foreground mb-2">
            {model.specialty?.name || "General"}
          </p>

          {/* Header / Title */}
          <h1 className="text-3xl font-bold text-foreground leading-tight mb-6">
            {model.name}
          </h1>

          {/* Architecture */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Architecture
            </h3>
            <span className="text-lg font-medium text-foreground">
              {model.architecture || "Deep Learning (Unspecified)"}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Abstract / Description
            </h3>
            <p className="text-foreground leading-relaxed">
              {model.description}
            </p>
          </div>

          {/* Original Article Link */}
          <div className="border-t border-border pt-6 flex justify-end">
            <a
              href={publicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              View Original Article
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
