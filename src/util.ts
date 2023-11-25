import { Difficulty, Prisma, Question } from "@prisma/client";
import { prisma } from "./db";

// Returns a map of difficulty to marks to count
export async function getQuestionCounts() {
    const difficultyCountMap = {
        [Difficulty.EASY]: {},
        [Difficulty.MEDIUM]: {},
        [Difficulty.HARD]: {},
    };
    const difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];

    await Promise.all(
        difficulties.map(async function (difficulty) {
            const counts = await prisma.question.groupBy({
                by: ['marks'],
                where: { difficulty },
                _count: true,
            });

            const countMap: { [mark: number]: number } = {};
            counts.forEach(function (countResult) {
                countMap[countResult.marks] = countResult._count || 0;
            });

            difficultyCountMap[difficulty] = countMap;
        })
    );

    return difficultyCountMap;
}

// A recursive backtracking approach to find a combination of questions that add up to the totalMarks
export function findDistribution(
    questionMarkCount: Record<string, number>,
    totalMarks: number
): Record<string, number> | null {
    const result: Record<string, number> = {};

    const sortedMarks = Object.keys(questionMarkCount).sort(
        function (a, b) {
            return parseInt(b) - parseInt(a);
        }
    );

    function backtrack(index: number, remainingMarks: number): boolean {
        if (index === sortedMarks.length) {
            return remainingMarks === 0;
        }
        const markValue = parseInt(sortedMarks[index]);
        const markCount = questionMarkCount[markValue.toString()];

        for (let i = 0; i <= markCount; i++) {
            const currentMarks = i * markValue;
            if (currentMarks > remainingMarks) {
                break;
            }

            result[markValue.toString()] = i;

            if (backtrack(index + 1, remainingMarks - currentMarks)) {
                return true;
            }
        }

        return false;
    }

    if (backtrack(0, totalMarks)) {
        return result;
    }

    return null;
}

// Makes a database query to fetch questions based on the difficulty and marks distribution
export async function fetchQuestions(difficulty: Difficulty, distribution: Record<string, number>) {
    const promises: Prisma.PrismaPromise<Question[]>[] = [];

    Object.keys(distribution).forEach(function (marks) {
        if (distribution[marks] === 0) {
            return;
        }
        console.log(`Fetching ${distribution[marks]} questions with ${marks} marks and difficulty ${difficulty}`);
        const question = prisma.question.findMany({
            where: {
                difficulty,
                marks: parseInt(marks),
            },
            take: distribution[marks],
        });

        promises.push(question);
    });

    const questions = await Promise.all(promises);

    return questions.flat();
}
