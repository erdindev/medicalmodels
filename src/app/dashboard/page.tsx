
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Box, ExternalLink } from "lucide-react";

const prisma = new PrismaClient();

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/signin");
    }

    const uploadedModels = await prisma.medicalModel.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            specialty: true,
            useCase: true
        }
    });

    return (
        <div className="min-h-screen container py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your models and account settings.
                    </p>
                </div>
                <Link
                    href="/models/upload"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Model
                </Link>
            </div>

            <div className="grid gap-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">
                            My Uploaded Models
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Models you have contributed to the platform.
                        </p>
                    </div>
                    <div className="p-6 pt-0">
                        {uploadedModels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-lg">
                                <Box className="h-10 w-10 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">No models yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    You haven't uploaded any models yet.
                                </p>
                                <Link
                                    href="/models/upload"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Upload your first model
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {uploadedModels.map((model: any) => (
                                    <div
                                        key={model.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div>
                                            <Link
                                                href={`/models/${model.slug}`}
                                                className="font-medium hover:underline"
                                            >
                                                {model.name}
                                            </Link>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                                                    v{model.version}
                                                </span>
                                                <span>•</span>
                                                <span>{model.specialty.name}</span>
                                                <span>•</span>
                                                <span>{model.useCase.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(model.createdAt).toLocaleDateString()}
                                            </div>
                                            <Link href={`/models/${model.slug}`} className="text-muted-foreground hover:text-foreground">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
