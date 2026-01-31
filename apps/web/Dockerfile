FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN corepack enable && corepack prepare pnpm@9.1.1 --activate

COPY . /app
RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "dev"]
