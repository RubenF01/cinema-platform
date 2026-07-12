SHELL := /bin/sh
API_DIR := apps/api
COMPOSE_FILE := infra/compose.yml

.PHONY: install dev infra-up infra-down infra-logs api-dev web-dev admin-dev lint format typecheck test migrate migration generate-api

install:
	yarn install
	cd $(API_DIR) && uv sync

dev:
	yarn dev

infra-up:
	docker compose -f $(COMPOSE_FILE) --env-file .env.example up -d

infra-down:
	docker compose -f $(COMPOSE_FILE) --env-file .env.example down

infra-logs:
	docker compose -f $(COMPOSE_FILE) --env-file .env.example logs -f

api-dev:
	cd $(API_DIR) && uv run uvicorn app.main:create_app --factory --reload --host 0.0.0.0 --port $${API_PORT:-8000}

web-dev:
	yarn workspace @cimena/web dev

admin-dev:
	yarn workspace @cimena/admin dev

lint:
	yarn lint
	cd $(API_DIR) && uv run ruff check .

format:
	yarn format
	cd $(API_DIR) && uv run ruff format .

typecheck:
	yarn typecheck
	cd $(API_DIR) && uv run mypy app tests

test:
	yarn test
	cd $(API_DIR) && uv run pytest

migrate:
	cd $(API_DIR) && uv run alembic upgrade head

migration:
	cd $(API_DIR) && uv run alembic revision --autogenerate -m "$${name:-migration}"

generate-api:
	yarn generate:api
