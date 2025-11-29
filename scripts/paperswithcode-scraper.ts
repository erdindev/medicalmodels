/**
 * Papers With Code Scraper
 *
 * Searches for medical AI papers that have associated code repositories.
 * Papers With Code has a free API.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PWC_API = "https://paperswithcode.com/api/v1";

// Medical AI search terms
const SEARCH_TERMS = [
  "medical imaging deep learning",
  "chest x-ray classification",
  "histopathology deep learning",
  "skin lesion classification",
  "dermoscopy melanoma",
  "CT scan segmentation",
  "MRI brain tumor",
  "retinal fundus",
  "mammography detection",
  "pathology whole slide",
  "radiology AI",
  "echocardiogram",
  "colonoscopy polyp",
  "endoscopy detection",
];

interface PWCPaper {
  id: string;
  title: string;
  abstract: string;
  url_abs: string;
  url_pdf: string;
  authors: string[];
  published: string;
  arxiv_id: string | null;
  proceeding: string | null;
}

interface PWCRepo {
  url: string;
  owner: string;
  name: string;
  description: string;
  stars: number;
  framework: string;
  is_official: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function determineSpecialty(title: string, abstract: string): string {
  const text = (title + " " + abstract).toLowerCase();

  if (text.includes("pathology") || text.includes("histopathology") || text.includes("whole slide") || text.includes("biopsy")) {
    return "pathology";
  }
  if (text.includes("dermato") || text.includes("skin") || text.includes("melanoma") || text.includes("dermoscopy")) {
    return "dermatology";
  }
  if (text.includes("x-ray") || text.includes("ct scan") || text.includes("mri") || text.includes("mammogra") || text.includes("radiol")) {
    return "radiology";
  }
  if (text.includes("retina") || text.includes("fundus") || text.includes("ophthalmol") || text.includes("eye")) {
    return "ophthalmology";
  }
  if (text.includes("ecg") || text.includes("electrocardiogram") || text.includes("cardiac") || text.includes("heart")) {
    return "cardiology";
  }
  if (text.includes("endoscop") || text.includes("colonoscop") || text.includes("gastro")) {
    return "gastroenterology";
  }

  return "other";
}

async function searchPapersWithCode(query: string): Promise<PWCPaper[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      page: "1",
      items_per_page: "50",
    });

    const response = await fetch(`${PWC_API}/papers/?${params}`);
    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (e) {
    console.error(`Error searching: ${e}`);
    return [];
  }
}

async function getPaperRepositories(paperId: string): Promise<PWCRepo[]> {
  try {
    const response = await fetch(`${PWC_API}/papers/${paperId}/repositories/`);
    if (!response.ok) return [];

    const data = await response.json();
    return data.results || data || [];
  } catch (e) {
    return [];
  }
}

async function savePaper(paper: PWCPaper, repos: PWCRepo[]): Promise<boolean> {
  const specialty = determineSpecialty(paper.title, paper.abstract);
  if (specialty === "other") return false;

  const officialRepo = repos.find((r) => r.is_official);
  const bestRepo = officialRepo || repos.sort((a, b) => b.stars - a.stars)[0];

  const codeLinks = repos.map((r) => r.url);

  try {
    // Check if already exists by arxiv_id or title
    const existing = paper.arxiv_id
      ? await prisma.scrapedPaper.findFirst({ where: { arxivId: paper.arxiv_id } })
      : await prisma.scrapedPaper.findFirst({ where: { title: paper.title } });

    if (existing) {
      // Update with code links
      await prisma.scrapedPaper.update({
        where: { id: existing.id },
        data: {
          githubUrl: bestRepo?.url || existing.githubUrl,
          codeLinks: JSON.stringify(codeLinks),
          hasModel: true,
          arxivUrl: paper.url_abs || existing.arxivUrl,
          pdfUrl: paper.url_pdf || existing.pdfUrl,
        },
      });
      return false; // Not a new paper
    }

    // Create new paper
    await prisma.scrapedPaper.create({
      data: {
        title: paper.title,
        abstract: paper.abstract || "",
        authors: JSON.stringify(paper.authors || []),
        arxivId: paper.arxiv_id,
        arxivUrl: paper.url_abs,
        pdfUrl: paper.url_pdf,
        pubDate: paper.published,
        journal: paper.proceeding,
        specialty,
        githubUrl: bestRepo?.url || null,
        codeLinks: JSON.stringify(codeLinks),
        hasModel: repos.length > 0,
        isProcessed: false,
      },
    });
    return true;
  } catch (e) {
    // Likely duplicate
    return false;
  }
}

async function scrapePapersWithCode(): Promise<void> {
  console.log("Starting Papers With Code scraper...\n");

  let newPapers = 0;
  let updatedPapers = 0;
  let totalWithCode = 0;

  for (const term of SEARCH_TERMS) {
    console.log(`\nSearching: "${term}"`);

    const papers = await searchPapersWithCode(term);
    console.log(`  Found ${papers.length} papers`);

    for (const paper of papers) {
      await sleep(200); // Rate limit

      // Get repositories for this paper
      const repos = await getPaperRepositories(paper.id);

      if (repos.length > 0) {
        totalWithCode++;
        const isNew = await savePaper(paper, repos);
        if (isNew) {
          newPapers++;
          console.log(`  [NEW] ${paper.title.substring(0, 50)}... (${repos.length} repos)`);
        } else {
          updatedPapers++;
        }
      }

      await sleep(100);
    }
  }

  console.log("\n=== Papers With Code Scraping Complete ===");
  console.log(`New papers added: ${newPapers}`);
  console.log(`Existing papers updated: ${updatedPapers}`);
  console.log(`Total papers with code found: ${totalWithCode}`);

  // Show summary
  const withCode = await prisma.scrapedPaper.count({ where: { hasModel: true } });
  const total = await prisma.scrapedPaper.count();
  console.log(`\nDatabase total: ${total} papers, ${withCode} with code`);
}

scrapePapersWithCode()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });
