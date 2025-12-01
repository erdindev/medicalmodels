import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 30;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE));
        const skip = (page - 1) * limit;

        // Filters
        const query = searchParams.get("q") || "";
        const specialty = searchParams.get("specialty") || "";
        const architecture = searchParams.get("architecture") || "";
        const validation = searchParams.get("validation") || "";
        const access = searchParams.get("access") || "";
        const journal = searchParams.get("journal") || "";
        const fda = searchParams.get("fda") === "true";
        const ce = searchParams.get("ce") === "true";
        const gdpr = searchParams.get("gdpr") === "true";

        // New filters: Modality, AUC, Accuracy, Sort
        const modality = searchParams.get("modality") || "";
        const aucMin = parseFloat(searchParams.get("aucMin") || "0");
        const aucMax = parseFloat(searchParams.get("aucMax") || "1");
        const accMin = parseFloat(searchParams.get("accMin") || "0");
        const accMax = parseFloat(searchParams.get("accMax") || "1");
        const sortBy = searchParams.get("sortBy") || "date";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        // Build where clause
        const where: Prisma.MedicalModelWhereInput = {};

        if (query) {
            const q = query.toLowerCase();
            where.OR = [
                { name: { contains: q } },
                { description: { contains: q } },
                { specialty: { name: { contains: q } } },
            ];
        }

        if (specialty) {
            where.specialty = { name: specialty };
        }

        if (architecture) {
            where.architecture = { contains: architecture };
        }

        if (journal) {
            where.journal = journal;
        }

        if (validation === "retrospective") {
            where.validation = { validationType: { in: ["retrospective", "both"] } };
        } else if (validation === "prospective") {
            where.validation = { validationType: { in: ["prospective", "both"] } };
        } else if (validation === "external") {
            where.validation = { externalValidation: true };
        }

        if (access) {
            where.practical = { accessType: access };
        }

        if (fda) {
            where.regulatory = { ...where.regulatory as object, fdaApproved: true };
        }
        if (ce) {
            where.regulatory = { ...where.regulatory as object, ceMark: true };
        }
        if (gdpr) {
            where.regulatory = { ...where.regulatory as object, gdprCompliant: true };
        }

        // Modality filter (search in name or description)
        if (modality) {
            const modalityTerms = modality.split(',').filter(Boolean);
            if (modalityTerms.length > 0) {
                where.OR = [
                    ...(where.OR || []),
                    ...modalityTerms.flatMap(term => [
                        { name: { contains: term } },
                        { description: { contains: term } }
                    ])
                ];
            }
        }

        // AUC range filter
        if (aucMin > 0 || aucMax < 1) {
            where.metrics = {
                ...where.metrics as object,
                auc: { gte: aucMin, lte: aucMax }
            };
        }

        // Accuracy range filter
        if (accMin > 0 || accMax < 1) {
            where.metrics = {
                ...where.metrics as object,
                accuracy: { gte: accMin, lte: accMax }
            };
        }

        // Get total count for pagination
        const total = await prisma.medicalModel.count({ where });

        // Get paginated models
        const models = await prisma.medicalModel.findMany({
            where,
            include: {
                metrics: true,
                specialty: true,
                useCase: true,
                validation: true,
                regulatory: true,
                practical: true,
                tags: {
                    include: {
                        tag: true
                    }
                }
            },
            orderBy: sortBy === 'auc'
                ? { metrics: { auc: sortOrder as 'asc' | 'desc' } }
                : sortBy === 'accuracy'
                ? { metrics: { accuracy: sortOrder as 'asc' | 'desc' } }
                : sortBy === 'name'
                ? { name: sortOrder as 'asc' | 'desc' }
                : { createdAt: sortOrder as 'asc' | 'desc' },
            skip,
            take: limit
        });

        // Transform to match frontend interface
        const transformedModels = models.map((m) => ({
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

        return NextResponse.json({
            models: transformedModels,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + models.length < total
            }
        });
    } catch (error) {
        console.error("[MODELS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            version,
            description,
            specialtyId,
            useCaseId,
            repositoryUrl,
            documentationUrl,
        } = body;

        if (!name || !version || !description || !specialtyId || !useCaseId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Generate a simple slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + "-" + Date.now();

        const model = await prisma.medicalModel.create({
            data: {
                name,
                slug,
                version,
                description,
                specialtyId,
                useCaseId,
                userId: session.user.id,
                practical: {
                    create: {
                        accessType: "open",
                        repositoryUrl,
                        documentationUrl,
                    },
                },
            },
        });

        return NextResponse.json(model);
    } catch (error) {
        console.error("[MODELS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
