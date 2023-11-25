// Import necessary modules
import { program } from 'commander';
import { prisma } from './db';
import { generateQuestionPaper } from './generateQuestions';


program
    .version('1.0.0')
    .description('Question Store - A CLI tool to store and retrive questions based on marks.');

// Define options and commands
program
    .command('length')
    .description('Outputs number of questions stored')
    .action(async () => {
        const length = await prisma.question.count();
        console.log(`Number of questions stored: ${length}`);
    });
// add command
program
    .command('add <question> <subject> <topic> <difficulty> <marks>')
    .description('Add a question to the store')
    .action(async (question, subject, topic, difficulty, marks) => {

        // check if we have all the required arguments
        if (!question || !subject || !topic || !difficulty || !marks) {
            console.log('Missing arguments');
            console.log("Usage: add <question> <subject> <topic> <difficulty> <marks>");
            return;
        }
        if (parseInt(marks) < 0) {
            console.log('Marks cannot be negative');
            return;
        }
        const newQuestion = await prisma.question.create({
            data: {
                question, subject, topic, difficulty,
                marks: parseInt(marks)
            }
        });
        console.log(`Question added with id: ${newQuestion.id}`);
    });
// remove command
program
    .command('remove <id>')
    .description('Remove a question from the store')
    .action(async (id) => {
        // check if we have all the required arguments
        if (!id) {
            console.log('Missing arguments');
            console.log("Usage: remove <id>");
            return;
        }
        const deletedQuestion = await prisma.question.delete({
            where: {
                id: parseInt(id)
            }
        });
        console.log(`Question with id: ${deletedQuestion.id} removed`);
    });

// list command
program
    .command('list')
    .description('List all questions in the store')
    .action(async () => {
        const questions = await prisma.question.findMany();
        if (questions.length === 0) {
            console.log("No questions found");
            return;
        }
        console.table(questions);
    });

// generate command
program
    .command('generate <totalMarks> <easyPercentage> <mediumPercentage> <hardPercentage>')
    .description('Generate a question paper')
    .action(async (totalMarks, easyPercentage, mediumPercentage, hardPercentage) => {
        // Validate input values
        if (
            isNaN(parseInt(totalMarks)) ||
            isNaN(parseInt(easyPercentage)) ||
            isNaN(parseInt(mediumPercentage)) ||
            isNaN(parseInt(hardPercentage))
        ) {
            console.log('Invalid input. Please provide valid numeric values for marks and percentages.');
            return;
        }

        // Call the question paper generation function
        const questionPaper = await generateQuestionPaper({
            totalMarks,
            easyPercentage,
            mediumPercentage,
            hardPercentage
        });

        const total = questionPaper.reduce((acc, question) => acc + question.marks, 0);
        console.log(`Total marks: ${total}`);
        console.table(questionPaper);
    });


// Set the default action to trigger the --help function
program
    .action(() => {
        program.help();
    });

// Parse the arguments and display outputs based on commands
program.parse(process.argv);
