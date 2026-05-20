# Global Traffic Intelligence Backend

Run everything from the repository root with a `.env` file present. The stack uses [Docker Compose](https://docs.docker.com/compose/) (Postgres + backend).

## Environment variables

Create a **`.env`** file in the project root (used by Compose for the **`backend`** service and by Prisma when you run commands on your machine). Include at least:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/global_traffic_intelligence?schema=public
PORT=8000
JWT_SECRET=change-me-use-a-long-random-string-in-production
AISSTREAM_API_KEY=your-api-key-from-aisstream
```

- **`DATABASE_URL`** — Postgres URL. Use **`localhost`** here when running **`npm run prisma:*`** from your PC against Postgres started by Compose (credentials match **`docker-compose.yml`**). The backend container overrides this with the Compose service hostname **`postgres`**.
- **`PORT`** — HTTP port the Node server listens on. Use **`8000`** so it matches the **`8000:8000`** port mapping on the **`backend`** service.
- **`JWT_SECRET`** — Secret used to sign session JWTs (`auth`). Use a strong value in production.
- **`AISSTREAM_API_KEY`** — API key from [AISStream](https://aisstream.io) for live vessel data (`wss://stream.aisstream.io`).

## Starting the application

Build images and start Postgres plus the backend in the foreground:

```bash
docker compose up --build
```

Start in the background (detached):

```bash
docker compose up --build -d
```

The API is reachable at **http://localhost:8000** (see `ports` under the `backend` service in `docker-compose.yml`).

## Database: generate, migrations, and seed users

With **Compose running** so Postgres is listening on **`localhost:5432`** and **`.env`** configured (including **`DATABASE_URL`** — see **Environment variables** above), run Prisma **on your machine** from the repo root (**`npm ci`** once).

Then:

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
```

That seeds **two** login users (`password123`):

| Login email        | Password     |
|--------------------|--------------|
| `alice@example.com`| `password123`|
| `bob@example.com`  | `password123`|

`npm run prisma:migrate:deploy` applies committed migrations without prompts. Use **`npm run prisma:migrate`** when authoring new migrations, then commit files under **`prisma/migrations/`**.

**Note:** Seed uses fixed emails; running it twice can hit a unique constraint. **`docker compose down -v`** and bringing the stack up again gives a fresh DB if you need to re-seed.

## Stopping the application

Stop and remove containers. Named volumes are kept (Postgres data remains):

```bash
docker compose down
```

Also remove volumes so the database starts empty next time:

```bash
docker compose down -v
```
