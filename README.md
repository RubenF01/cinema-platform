# Cimena Platform

A production-ready full-stack application foundation with two Next.js applications, a FastAPI backend, shared frontend packages, local infrastructure, and generated TypeScript API client code.

This scaffold is intentionally generic. It does not include authentication, authorization, business modules, domain entities, sample inventory, reservations, or speculative product logic.

## Architecture

- `apps/web`: customer-facing Next.js App Router application.
- `apps/admin`: separate admin Next.js App Router application.
- `apps/api`: FastAPI modular monolith backend.
- `packages/ui`: shared generic React components.
- `packages/api-client`: generated TypeScript API client based on FastAPI OpenAPI.
- `packages/eslint-config`: shared ESLint configurations.
- `packages/typescript-config`: shared TypeScript configurations.
- `infra/compose.yml`: local PostgreSQL, Redis, MinIO, and Mailpit.

## Technology Choices

JavaScript dependencies use Yarn 4 Berry with workspaces and Turborepo. The project uses `nodeLinker: node-modules` instead of Plug'n'Play because it is the least surprising strategy for Next.js, Turborepo, generated clients, editor tooling, and mixed JavaScript/Python development.

The backend uses Python with uv, FastAPI, Pydantic Settings, SQLAlchemy 2, Alembic, Redis, Ruff, mypy, and pytest.

API client generation uses Hey API OpenAPI TypeScript. FastAPI OpenAPI is the source of truth, and the generation command imports the app directly, so the API server does not need to be running.

## Prerequisites

- Node.js 22 or a compatible current LTS version
- Corepack enabled
- Yarn 4 through Corepack
- Python 3.12+
- uv
- Docker and Docker Compose

## Install

```sh
corepack enable
yarn install
cd apps/api && uv sync
```

Or use:

```sh
make install
```

## Environment

Copy `.env.example` to `.env` for local overrides. The example file contains only local development values and no real credentials.

## Infrastructure

```sh
make infra-up
make infra-logs
make infra-down
```

Local service URLs:

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MinIO API: `http://localhost:9000`
- MinIO console: `http://localhost:9001`
- Mailpit SMTP: `localhost:1025`
- Mailpit web UI: `http://localhost:8025`

PostgreSQL is the future source of truth for persistent business data. Redis is reserved for transient data such as caches, messaging, and locks. MinIO provides S3-compatible object storage for local development. Mailpit captures outbound development email without sending real mail.

## Run Applications

Run all JavaScript applications and packages through Turborepo:

```sh
yarn dev
```

Run each app separately:

```sh
make api-dev
make web-dev
make admin-dev
```

Default app URLs:

- API: `http://localhost:8000`
- Web: `http://localhost:3000`
- Admin: `http://localhost:3001`

## Database Migrations

```sh
make migrate
make migration name="describe change"
cd apps/api && uv run alembic downgrade -1
```

## API Client Generation

```sh
yarn generate:api
```

This exports OpenAPI from the FastAPI app and regenerates `packages/api-client/src/generated`. The FastAPI server does not need to be running.

## Quality Checks

```sh
yarn lint
yarn typecheck
yarn test
yarn build
yarn format:check
```

Backend checks:

```sh
cd apps/api
uv run ruff check .
uv run ruff format --check .
uv run mypy app tests
uv run pytest
```

## Troubleshooting

- Run `corepack enable` if `yarn` is unavailable.
- Run `yarn install --immutable` in CI and after lockfile updates.
- Make sure Docker is running before `make infra-up`.
- If health checks fail, verify PostgreSQL and Redis are running and `.env` matches `.env.example`.
- If API client generation fails, run `cd apps/api && uv sync` first.

## Future Phases

Future phases may add authentication, authorization, file uploads, background jobs, real-time updates, payments, notifications, audit logs, and business modules. They are intentionally not implemented in this foundation.
