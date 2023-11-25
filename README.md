# question-store

A CLI tool that generates a question paper based on specified requirements.

## Tech-Stack

- Postgres : Database
- Prisma : ORM
- Typescript : Language
- Commander : CLI management

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
