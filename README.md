# question-store

A CLI tool that generates a question paper based on specified requirements.

This is a solution to [Backend Developer Assignment](https://santoshbaggam.notion.site/Coding-Assignment-f91feb20dce34ab39428ebe8a5131e4e)

## Usage

```bash
Usage: index [options] [command]

Question Store - A CLI tool to store and retrive questions based on marks.

Options:
  -V, --version                                                               output the version number
  -h, --help                                                                  display help for command

Commands:
  length                                                                      Outputs number of questions stored
  add <question> <subject> <topic> <difficulty> <marks>                       Add a question to the store
  remove <id>                                                                 Remove a question from the store
  list                                                                        List all questions in the store
  generate <totalMarks> <easyPercentage> <mediumPercentage> <hardPercentage>  Generate a question paper
```

## Approach Overview

The goal of this backend developer assignment is to create a robust system that caters to the needs of a user (teacher) interacting with a Command Line Interface (CLI) application. This CLI application communicates with a globally distributed database. The assignment includes the handling of a real-world problem, where the user interacts with the CLI to manage and query a database containing questions of varying difficulty levels.

## Assumptions

1. **Real-World Problem Scenario:** The selected approach addresses a real-world problem, simulating a teacher interacting with a CLI application to manage and query questions within a globally distributed database.

2. **Question Difficulty and Marking System:**
   - Easy Questions: 1-2 marks
   - Medium Questions: 3-6 marks
   - Hard Questions: 6-10 marks

3. **Sample Data Generator:**
   - Utilizes the openTDB API to generate questions.
   - Assigns marks to questions based on the specified difficulty level and marking system.

4. **Database Seeding:**
   - The generated data from the Sample Data Generator can be seeded into the database.

5. **Database Interaction:**
   - Prisma is employed for querying the database.

## Implementation Steps

1. **CLI Application Design:**
   - The CLI application is designed to offer an intuitive interface for the user (teacher) to interact with the system.
   - Commands are structured to facilitate actions such as adding, querying, and managing questions.

2. **Sample Data Generation:**
   - The Sample Data Generator fetches questions from openTDB.
   - Marks are assigned based on the defined difficulty and marking system.
   - Generated data is formatted and ready for seeding into the database.

3. **Database Schema:**
   - Prisma is utilized to define the schema for the globally distributed database.
   - Schemas include tables for questions, users, and any other relevant entities.

4. **Database Seeding:**
   - The generated data is seamlessly seeded into the database using Prisma.
   - This ensures that the database is populated with questions of varying difficulty levels.

5. **Querying the Database:**
   - Prisma provides a reliable mechanism for querying the database.
   - Queries are designed to retrieve questions based on user requirements, such as difficulty level and marks.

6. **Generate Command:**
   - **Marks Count Query:**
     - The database is scanned to determine the count of questions for each mark, using an aggregation query.
   - **Marks Distribution:**
     - Marks distribution is calculated using a recursive backtracking approach.
     - This step defines how many questions are needed for each mark.
   - **Parallel Fetching:**
     - Questions are fetched in parallel using `Promise.all` in JavaScript and Prisma ORM.
     - This ensures efficient and speedy retrieval of questions based on the calculated distribution.

7. **Error Handling:**
   - The system incorporates robust error handling mechanisms to gracefully manage any unexpected scenarios during CLI interactions, data generation, seeding, or database queries.

8. **npm Scripts:**
   - The project utilizes npm scripts for various development and build tasks. Key scripts include:
      - `start`: Launches the application using the compiled index file.
      - `build:watch`: Monitors TypeScript source files for changes and triggers a rebuild.
      - `build`: Compiles TypeScript files using SWC, and then removes unnecessary build artifacts.
      - `clean`: Removes the `dist` directory.
      - `lint`: Runs ESLint to check and fix coding style issues.
      - `init-dataset`: Transpiles and runs the Sample Data Generator script to initialize the dataset.
      - `db:generate`: Generates Prisma client.
      - `db:push`: Pushes changes to the database using Prisma.
      - `db:seed`: Seeds the database with sample data using Prisma.
      - `db:reset`: Resets the database by rolling back migrations, forcing a reapply.

## Area Of Improvements

- **API Integration:**
  - This system can be easily integrated into an API server, providing a scalable and accessible solution for users.

- **OpenAI API Integration:**
  - The openTDB API can be complemented or replaced with the OpenAI API for question generation, enhancing the variety and complexity of questions.

- **Assumption Adjustment:**
  - Assumptions about the marking system and difficulty levels can be adjusted to optimize the calculation of marks distribution for faster execution.

## Dependencies

- Postgres : Database
- Prisma : ORM
- Typescript : Language
- Commander : CLI management
- OpenTDB : Question generation

## Prerequisites

- Node.js 10+
- pnpm or yarn or npm

## Getting Started

- Clone this repository

```bash
git clone https://github.com/vishalx360/question-store.git
```

- Install dependencies

```bash
pnpm install
```

- Build application

```bash
pnpm build
```

- Start Application

```bash
pnpm start
```

Follow usage instructions to use the CLI tool.
