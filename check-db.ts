
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.medicalModel.count();
        console.log(`MedicalModel count: ${count}`);

        const models = await prisma.medicalModel.findMany({
            take: 5,
            select: { name: true, slug: true }
        });
        console.log('First 5 models:', models);

    } catch (error) {
        console.error('Error counting models:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
