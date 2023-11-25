import { Difficulty, Question } from "@prisma/client";
import { findDistribution, fetchQuestions, getQuestionCounts } from "./util";

/**
 * Generates a question paper based on specified requirements.
 * @param totalMarks - The total marks for the question paper.
 * @param easyPercentage - The percentage of easy questions.
 * @param mediumPercentage - The percentage of medium questions.
 * @param hardPercentage - The percentage of hard questions.
 * @returns A list of questions for the generated question paper.
 */
export async function generateQuestionPaper({
    totalMarks,
    easyPercentage,
    mediumPercentage,
    hardPercentage,
}: {
    totalMarks: number;
    easyPercentage: number;
    mediumPercentage: number;
    hardPercentage: number;
}) {
    const easyMarks = Math.round((easyPercentage / 100) * totalMarks);
    const mediumMarks = Math.round((mediumPercentage / 100) * totalMarks);
    const hardMarks = Math.round((hardPercentage / 100) * totalMarks);

    console.log("Question paper requirements:");
    console.log(`Total marks: ${totalMarks}`);
    console.log(`Easy marks: ${easyMarks} (${easyPercentage}%)`);
    console.log(`Medium marks: ${mediumMarks} (${mediumPercentage}%)`);
    console.log(`Hard marks: ${hardMarks} (${hardPercentage}%)`);

    const questions: Question[] = [];

    console.log("\n");
    console.log("Scanning database : fetching question counts ...");
    const questionCount = await getQuestionCounts();
    console.log("Question count:");
    console.log(questionCount);

    console.log("\n");
    console.log("Calculating marks distribution ...");
    const easyMarksDistribution = findDistribution(questionCount["EASY"], easyMarks);
    const mediumMarksDistribution = findDistribution(questionCount["MEDIUM"], mediumMarks);
    const hardMarksDistribution = findDistribution(questionCount["HARD"], hardMarks);

    console.log("\n");
    if (!easyMarksDistribution || !mediumMarksDistribution || !hardMarksDistribution) {
        console.error('No valid question combination found for this requirement.');
        process.exit(1);
    } else {
        console.log("Question distribution:")
        console.log({
            EASY: easyMarksDistribution,
            MEDIUM: mediumMarksDistribution,
            HARD: hardMarksDistribution,
        })
    }

    console.log("\n");
    console.log("Fetching questions ...");
    const easyQuestions = await fetchQuestions(Difficulty.EASY, easyMarksDistribution);
    const mediumQuestions = await fetchQuestions(Difficulty.MEDIUM, mediumMarksDistribution);
    const hardQuestions = await fetchQuestions(Difficulty.HARD, hardMarksDistribution);

    questions.push(...easyQuestions);
    questions.push(...mediumQuestions);
    questions.push(...hardQuestions);

    return questions;
}
