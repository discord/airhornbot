# airhornbot

A TypeScript implementation of AIRHORN SOLUTIONS.

# Setup

Prerequisites:

- Postgres Server
- Node.js v18 (and npm)

## Website

Build the website for the bot.

Example commands:

```bash
cd website
npm install
cp .env.example .env
# Edit the .env file to have the correct values for your setup
npm run build
```

## Bot

Build the bot and web server process.

Example commands:

```bash
cd bot
npm install
cp .env.example .env
# Edit the .env file to have the correct values for your setup
npx prisma generate
npm run build
npx prisma migrate deploy
```

To run the bot:

```bash
cd bot
npm run bot
```

To run the web server:

```bash
cd bot
npm run web
```
