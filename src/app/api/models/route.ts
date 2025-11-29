
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        const models = await prisma.medicalModel.findMany({
            where: query ? {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { specialty: { name: { contains: query } } },
                ]
            } : undefined,
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

        // Transform to match the frontend interface if needed, or just return as is
        // The frontend expects a specific structure. Let's try to match it or update frontend.
        // For now, return raw data and we'll adapt frontend.
        return NextResponse.json(models);
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
                        accessType: "open", // Default for MVP
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
