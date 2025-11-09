# Webhook challenge

This project is a monorepo containing a web application and an API to manage webhooks.

## About

The goal of this challenge is to create a screen to list and view details of a webhook, and also a screen to create a new webhook.

## Project Structure

The project is a monorepo with two main packages:

- `api`: A [Fastify](https://fastify.io/) application that provides the backend services for the web application.
- `web`: A [React](https://react.dev/) application built with [Vite](https://vitejs.dev/) that provides the user interface.

## Technologies Used

### API

- [Fastify](https://fastify.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/)

### Web

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Router](https://tanstack.com/router/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/example/repo.git
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

### Running the Application

1. Start the API:

   ```bash
   pnpm --filter api dev
   ```

2. Start the web application:

   ```bash
   pnpm --filter web dev
   ```

The web application will be available at `http://localhost:5173`.
