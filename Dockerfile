FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# prisma.config.ts requires DATABASE_URL when the CLI loads; generate does not open a DB connection.
ARG DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/postgres"
ENV DATABASE_URL=$DATABASE_URL

RUN npm run prisma:generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]