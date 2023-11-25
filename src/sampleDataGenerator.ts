import fs from 'fs/promises';
import fetch from 'node-fetch';
import he from 'he';

interface TMDBQuestionResponse {
    type: "multiple";
    difficulty: "easy" | "medium" | "hard";
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface Question {
    question: string;
    subject: string;
    topic: string;
    difficulty: string;
    marks: number;
}

interface CategoryCountResponse {
    category_id: number;
    category_question_count: {
        total_question_count: number;
        total_easy_question_count: number;
        total_medium_question_count: number;
        total_hard_question_count: number;
    };
}


interface QuestionCount {
    total: number;
    easy: number;
    medium: number;
    hard: number;
}

async function fetchQuestions(amount: number, category: number, difficulty: "easy" | "medium" | "hard",) {
    const apiUrl = new URL('https://opentdb.com/api.php');
    apiUrl.searchParams.append('amount', amount.toString());
    apiUrl.searchParams.append('category', category.toString());
    apiUrl.searchParams.append('difficulty', difficulty);
    try {
        // console.log(`Request URL: ${apiUrl.toString()}`);

        const response = await fetch(apiUrl.toString());
        const data = await response.json() as { response_code: number, results: TMDBQuestionResponse[] };

        const categoryParts = data.results[0].category.toLocaleLowerCase().split(': ');
        const subject = categoryParts[0];
        const topic = categoryParts.length > 1 ? categoryParts[1] : categoryParts[0];

        return data.results.map((result: TMDBQuestionResponse) => ({
            question: he.decode(result.question), // Decode HTML entities
            subject,
            topic,
            difficulty: difficulty.toUpperCase(),
            marks: getMarksForDifficulty(difficulty),
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}


async function getCategoryQuestionCount(categoryId: number): Promise<QuestionCount | null> {
    const apiUrl = new URL('https://opentdb.com/api_count.php');
    apiUrl.searchParams.append('category', categoryId.toString());

    try {
        const response = await fetch(apiUrl.toString());
        const data = await response.json() as CategoryCountResponse;

        return {
            total: data.category_question_count.total_question_count,
            easy: data.category_question_count.total_easy_question_count,
            medium: data.category_question_count.total_medium_question_count,
            hard: data.category_question_count.total_hard_question_count,
        };
    } catch (error) {
        console.error('Error fetching category question count:', error);
        return null;
    }
}

function getMarksForDifficulty(difficulty: string): number {
    const getRandomNumber = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    switch (difficulty.toLowerCase()) {
        case 'easy':
            return getRandomNumber(1, 2);
        case 'medium':
            return getRandomNumber(3, 6);
        case 'hard':
            return getRandomNumber(6, 10);
        default:
            return 0;
    }
}

async function run() {
    const allQuestions: Question[] = [];
    const categories = [9, 22, 21, 18, 30, 10, 19];
    const difficulties = ['easy', 'medium', 'hard'] as const;

    for (const category of categories) {
        console.log("\n");
        const categoryQuestionCount = await getCategoryQuestionCount(category);

        for (const difficulty of difficulties) {
            const amount = categoryQuestionCount ? Math.min(50, categoryQuestionCount[difficulty]) : 20;
            console.log(`Fetching ${amount} questions for category ${category} with difficulty ${difficulty} ...`);
            const questions = await fetchQuestions(amount, category, difficulty);
            allQuestions.push(...questions);

            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        }
    }

    console.log("\n");

    const jsonData = JSON.stringify(allQuestions, null, 2);

    try {
        await fs.writeFile('prisma/sampleData.json', jsonData, 'utf-8');
        console.log(`Success: ${allQuestions.length} Questions have been written to questions.json`);
    } catch (error) {
        console.error('Failed: Error writing to file:', error);
    }
}

run();
