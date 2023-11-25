import { PrismaClient } from "@prisma/client";
import questionsData from './sampleData.json' assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
    console.log('started seeding');
    // Map the difficulty values to the Difficulty enum
    const mappedQuestionsData = questionsData.map((question) => ({
        ...question,
        difficulty: question.difficulty.toUpperCase(),
    }));
    // Seed the database with questions
    await prisma.question.createMany({
        data: mappedQuestionsData,
    });
    console.log('Seed data inserted successfully');
}
main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

//# sourceMappingURL=seed.js.map
