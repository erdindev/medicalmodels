
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const papers = await prisma.scrapedPaper.findMany({
        select: {
            id: true,
            title: true,
            abstract: true,
        },
    });

    let output = "";
    papers.forEach((p, index) => {
        output += `--- PAPER ${index + 1} ---\n`;
        output += `ID: ${p.id}\n`;
        output += `TITLE: ${p.title}\n`;
        output += `ABSTRACT: ${p.abstract}\n\n`;
    });

    fs.writeFileSync('remaining_papers.txt', output);
    console.log(`Exported ${papers.length} papers to remaining_papers.txt`);
    await prisma.$disconnect();
}

main();
