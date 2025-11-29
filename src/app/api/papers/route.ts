import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const specialty = searchParams.get("specialty");
  const hasModel = searchParams.get("hasModel");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const where: Record<string, unknown> = {};

    if (specialty && specialty !== "all") {
      where.specialty = specialty;
    }

    if (hasModel === "true") {
      where.hasModel = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { abstract: { contains: search } },
      ];
    }

    const [papers, total] = await Promise.all([
      prisma.scrapedPaper.findMany({
        where,
        orderBy: { pubDate: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          abstract: true,
          authors: true,
          journal: true,
          pubDate: true,
          specialty: true,
          pubmedUrl: true,
          arxivUrl: true,
          githubUrl: true,
          hasModel: true,
          doi: true,
          pmid: true,
        },
      }),
      prisma.scrapedPaper.count({ where }),
    ]);

    return NextResponse.json({
      papers,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 });
  }
}
