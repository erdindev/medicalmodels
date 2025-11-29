import { demoModels } from "@/lib/data";
import { HeroSearch } from "@/components/home/hero-search";
import { ModelsGrid } from "@/components/home/models-grid";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.toLowerCase() : "";
  const specialty = typeof params.specialty === "string" ? params.specialty : "";

  // Filter models based on search params
  const filteredModels = demoModels.filter((model) => {
    const matchesQuery =
      !query ||
      model.name.toLowerCase().includes(query) ||
      model.specialty.toLowerCase().includes(query) ||
      model.tags.some((t) => t.includes(query));

    const matchesSpecialty = !specialty || model.specialty === specialty;

    return matchesQuery && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <HeroSearch />

      {/* Features / Emphasis Section */}
      <section className="bg-secondary/30 py-12 border-y border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Specialty-First Search</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Find the right model for your clinical department. Filter by Radiology, Dermatology, Pathology, and more.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Medically Validated</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Prioritize safety. Filter models by FDA approval, CE marking, and prospective clinical trial validation.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Evidence Based</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Direct access to peer-reviewed publications, performance metrics, and training data sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ModelsGrid models={filteredModels} />
    </div>
  );
}
