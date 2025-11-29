/**
 * PubMed Scraper for Medical AI Papers
 *
 * Searches PubMed for deep learning papers in:
 * - Radiology
 * - Pathology
 * - Dermatology
 *
 * Extracts: Title, Abstract, Authors, DOI, PubMed ID, Links, GitHub repos
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PubMed E-utilities base URL
const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

// Search queries for medical AI papers
const SEARCH_QUERIES = [
  // Radiology
  '("deep learning"[Title/Abstract] OR "machine learning"[Title/Abstract] OR "artificial intelligence"[Title/Abstract] OR "neural network"[Title/Abstract]) AND ("radiology"[Title/Abstract] OR "chest x-ray"[Title/Abstract] OR "CT scan"[Title/Abstract] OR "MRI"[Title/Abstract] OR "medical imaging"[Title/Abstract])',

  // Pathology
  '("deep learning"[Title/Abstract] OR "machine learning"[Title/Abstract] OR "convolutional neural network"[Title/Abstract]) AND ("pathology"[Title/Abstract] OR "histopathology"[Title/Abstract] OR "whole slide image"[Title/Abstract] OR "digital pathology"[Title/Abstract])',

  // Dermatology
  '("deep learning"[Title/Abstract] OR "machine learning"[Title/Abstract] OR "CNN"[Title/Abstract]) AND ("dermatology"[Title/Abstract] OR "skin cancer"[Title/Abstract] OR "melanoma"[Title/Abstract] OR "dermoscopy"[Title/Abstract])',
];

const SPECIALTY_MAP: Record<number, string> = {
  0: "radiology",
  1: "pathology",
  2: "dermatology",
};

interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  pubDate: string;
  doi: string | null;
  pmc: string | null;
  keywords: string[];
  meshTerms: string[];
}

// Rate limiting helper
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Search PubMed and get PMIDs
async function searchPubMed(query: string, maxResults: number = 100): Promise<string[]> {
  const params = new URLSearchParams({
    db: "pubmed",
    term: query,
    retmax: maxResults.toString(),
    retmode: "json",
    sort: "relevance",
    // Only papers from last 5 years
    datetype: "pdat",
    mindate: "2019",
    maxdate: "2025",
  });

  const url = `${PUBMED_BASE}/esearch.fcgi?${params}`;
  console.log(`Searching: ${query.substring(0, 50)}...`);

  const response = await fetch(url);
  const data = await response.json();

  return data.esearchresult?.idlist || [];
}

// Fetch article details from PubMed
async function fetchArticleDetails(pmids: string[]): Promise<PubMedArticle[]> {
  if (pmids.length === 0) return [];

  const params = new URLSearchParams({
    db: "pubmed",
    id: pmids.join(","),
    retmode: "xml",
    rettype: "abstract",
  });

  const url = `${PUBMED_BASE}/efetch.fcgi?${params}`;
  const response = await fetch(url);
  const xml = await response.text();

  return parseArticlesXml(xml);
}

// Parse PubMed XML response
function parseArticlesXml(xml: string): PubMedArticle[] {
  const articles: PubMedArticle[] = [];

  // Simple regex-based parsing (could use xml2js for more robust parsing)
  const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];

  for (const articleXml of articleMatches) {
    try {
      const pmid = extractTag(articleXml, "PMID") || "";
      const title = extractTag(articleXml, "ArticleTitle") || "";
      const abstract = extractTag(articleXml, "AbstractText") || "";
      const journal = extractTag(articleXml, "Title") || "";

      // Extract authors
      const authorMatches = articleXml.match(/<Author[\s\S]*?<\/Author>/g) || [];
      const authors = authorMatches.map((a) => {
        const lastName = extractTag(a, "LastName") || "";
        const foreName = extractTag(a, "ForeName") || "";
        return `${foreName} ${lastName}`.trim();
      }).filter(Boolean);

      // Extract publication date
      const year = extractTag(articleXml, "Year") || "";
      const month = extractTag(articleXml, "Month") || "01";
      const day = extractTag(articleXml, "Day") || "01";
      const pubDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      // Extract DOI
      const doiMatch = articleXml.match(/<ArticleId IdType="doi">([^<]+)<\/ArticleId>/);
      const doi = doiMatch ? doiMatch[1] : null;

      // Extract PMC ID
      const pmcMatch = articleXml.match(/<ArticleId IdType="pmc">([^<]+)<\/ArticleId>/);
      const pmc = pmcMatch ? pmcMatch[1] : null;

      // Extract keywords
      const keywordMatches = articleXml.match(/<Keyword[^>]*>([^<]+)<\/Keyword>/g) || [];
      const keywords = keywordMatches.map((k) => k.replace(/<[^>]+>/g, ""));

      // Extract MeSH terms
      const meshMatches = articleXml.match(/<DescriptorName[^>]*>([^<]+)<\/DescriptorName>/g) || [];
      const meshTerms = meshMatches.map((m) => m.replace(/<[^>]+>/g, ""));

      if (pmid && title) {
        articles.push({
          pmid,
          title: cleanText(title),
          abstract: cleanText(abstract),
          authors,
          journal: cleanText(journal),
          pubDate,
          doi,
          pmc,
          keywords,
          meshTerms,
        });
      }
    } catch (e) {
      console.error("Error parsing article:", e);
    }
  }

  return articles;
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ")    // Normalize whitespace
    .trim();
}

// Extract GitHub links from abstract
function extractGitHubLinks(text: string): string[] {
  const githubRegex = /https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+/gi;
  return [...new Set(text.match(githubRegex) || [])];
}

// Extract any code repository links
function extractCodeLinks(text: string): string[] {
  const patterns = [
    /https?:\/\/github\.com\/[^\s<>"]+/gi,
    /https?:\/\/gitlab\.com\/[^\s<>"]+/gi,
    /https?:\/\/bitbucket\.org\/[^\s<>"]+/gi,
    /https?:\/\/huggingface\.co\/[^\s<>"]+/gi,
    /https?:\/\/zenodo\.org\/[^\s<>"]+/gi,
  ];

  const links: string[] = [];
  for (const pattern of patterns) {
    const matches = text.match(pattern) || [];
    links.push(...matches);
  }

  return [...new Set(links)];
}

// Save paper to database
async function savePaper(article: PubMedArticle, specialty: string): Promise<void> {
  const codeLinks = extractCodeLinks(article.abstract);
  const githubLinks = extractGitHubLinks(article.abstract);

  try {
    await prisma.scrapedPaper.upsert({
      where: { pmid: article.pmid },
      update: {
        title: article.title,
        abstract: article.abstract,
        authors: JSON.stringify(article.authors),
        journal: article.journal,
        pubDate: article.pubDate,
        doi: article.doi,
        pmcId: article.pmc,
        keywords: JSON.stringify(article.keywords),
        meshTerms: JSON.stringify(article.meshTerms),
        specialty,
        codeLinks: JSON.stringify(codeLinks),
        githubUrl: githubLinks[0] || null,
        pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`,
        updatedAt: new Date(),
      },
      create: {
        pmid: article.pmid,
        title: article.title,
        abstract: article.abstract,
        authors: JSON.stringify(article.authors),
        journal: article.journal,
        pubDate: article.pubDate,
        doi: article.doi,
        pmcId: article.pmc,
        keywords: JSON.stringify(article.keywords),
        meshTerms: JSON.stringify(article.meshTerms),
        specialty,
        codeLinks: JSON.stringify(codeLinks),
        githubUrl: githubLinks[0] || null,
        pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`,
        hasModel: githubLinks.length > 0 || codeLinks.length > 0,
        isProcessed: false,
      },
    });
  } catch (e) {
    console.error(`Error saving paper ${article.pmid}:`, e);
  }
}

// Main scraper function
async function scrapePubMed(maxPerQuery: number = 50): Promise<void> {
  console.log("Starting PubMed scraper...\n");

  let totalPapers = 0;
  let papersWithCode = 0;

  for (let i = 0; i < SEARCH_QUERIES.length; i++) {
    const query = SEARCH_QUERIES[i];
    const specialty = SPECIALTY_MAP[i];

    console.log(`\n=== Scraping ${specialty.toUpperCase()} ===`);

    // Search for PMIDs
    const pmids = await searchPubMed(query, maxPerQuery);
    console.log(`Found ${pmids.length} papers`);

    // Rate limit: 3 requests per second for PubMed
    await sleep(400);

    // Fetch details in batches of 20
    const batchSize = 20;
    for (let j = 0; j < pmids.length; j += batchSize) {
      const batch = pmids.slice(j, j + batchSize);
      const articles = await fetchArticleDetails(batch);

      for (const article of articles) {
        await savePaper(article, specialty);
        totalPapers++;

        const hasCode = extractCodeLinks(article.abstract).length > 0;
        if (hasCode) {
          papersWithCode++;
          console.log(`  [CODE] ${article.title.substring(0, 60)}...`);
        }
      }

      console.log(`  Processed ${Math.min(j + batchSize, pmids.length)}/${pmids.length}`);
      await sleep(400); // Rate limit
    }
  }

  console.log("\n=== Scraping Complete ===");
  console.log(`Total papers: ${totalPapers}`);
  console.log(`Papers with code links: ${papersWithCode}`);
}

// Run if called directly
scrapePubMed(100)
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });
