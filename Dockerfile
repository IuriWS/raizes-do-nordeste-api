FROM node:22-bookworm

WORKDIR /app

ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/raizes_do_nordeste?schema=public"

COPY package*.json ./
RUN npm ci

COPY jest*.config.ts nest-cli.json tsconfig*.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm run prisma:generate

COPY src ./src
COPY test ./test
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
