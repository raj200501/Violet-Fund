.PHONY: dev ingest scrape test fmt install

install:
	./scripts/pnpm_install.sh

dev:
	docker compose up --build -d
	docker compose exec api alembic upgrade head
	docker compose exec api python -m app.scripts.ingest

ingest:
	docker compose exec api python -m app.scripts.ingest

scrape:
	docker compose exec api python -m app.scripts.scrape

test:
	docker compose exec api pytest
	pnpm --filter web lint
	pnpm --filter web build

fmt:
	docker compose exec api ruff check --fix app tests
	docker compose exec api black app tests
	pnpm --filter web lint --fix
