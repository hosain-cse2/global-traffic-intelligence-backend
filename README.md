# Global Traffic Intelligence Backend

Run everything from the repository root with a `.env` file present. The stack uses [Docker Compose](https://docs.docker.com/compose/) (Postgres + backend).

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

## Stopping the application

Stop and remove containers. Named volumes are kept (Postgres data remains):

```bash
docker compose down
```

Also remove volumes so the database starts empty next time:

```bash
docker compose down -v
```
